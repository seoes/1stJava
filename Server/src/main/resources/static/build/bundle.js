
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.53.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Component/BoxOffice.svelte generated by Svelte v3.53.1 */

    const file$a = "src/Component/BoxOffice.svelte";

    function create_fragment$b(ctx) {
    	let div6;
    	let div2;
    	let div1;
    	let div0;
    	let h50;
    	let t1;
    	let span;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let p3;
    	let t9;
    	let p4;
    	let t11;
    	let div5;
    	let div4;
    	let div3;
    	let h51;
    	let t13;
    	let p5;
    	let t15;
    	let p6;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h50 = element("h5");
    			h50.textContent = "일간 박스오피스";
    			t1 = space();
    			span = element("span");
    			p0 = element("p");
    			p0.textContent = "1위 아바타2";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "2위 데시벨";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "3위 헤어질 결심";
    			t7 = space();
    			p3 = element("p");
    			p3.textContent = "4위 아마겟돈 타임";
    			t9 = space();
    			p4 = element("p");
    			p4.textContent = "5위 녹색광선";
    			t11 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			h51 = element("h5");
    			h51.textContent = "주간 박스오피스";
    			t13 = space();
    			p5 = element("p");
    			p5.textContent = "안녕하세요 영화 SNS입니다 감사합니다";
    			t15 = space();
    			p6 = element("p");
    			add_location(h50, file$a, 14, 16, 350);
    			attr_dev(p0, "class", "svelte-s2kace");
    			add_location(p0, file$a, 15, 22, 390);
    			add_location(span, file$a, 15, 16, 384);
    			attr_dev(p1, "class", "svelte-s2kace");
    			add_location(p1, file$a, 16, 16, 428);
    			attr_dev(p2, "class", "svelte-s2kace");
    			add_location(p2, file$a, 17, 16, 458);
    			attr_dev(p3, "class", "svelte-s2kace");
    			add_location(p3, file$a, 18, 16, 491);
    			attr_dev(p4, "class", "svelte-s2kace");
    			add_location(p4, file$a, 19, 16, 525);
    			attr_dev(div0, "class", "card-body svelte-s2kace");
    			add_location(div0, file$a, 13, 12, 310);
    			attr_dev(div1, "class", "uk-card uk-card-default");
    			add_location(div1, file$a, 12, 8, 260);
    			add_location(div2, file$a, 11, 4, 246);
    			add_location(h51, file$a, 26, 16, 696);
    			attr_dev(div3, "class", "uk-card-body");
    			add_location(div3, file$a, 25, 12, 653);
    			attr_dev(div4, "class", "uk-card uk-card-default");
    			add_location(div4, file$a, 24, 8, 603);
    			add_location(div5, file$a, 23, 4, 589);
    			attr_dev(div6, "class", "uk-grid-column-small uk-grid-row-small uk-child-width-1-1 uk-child-width-1-2@m");
    			attr_dev(div6, "uk-grid", "");
    			add_location(div6, file$a, 10, 0, 141);
    			add_location(p5, file$a, 31, 0, 766);
    			add_location(p6, file$a, 32, 0, 795);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h50);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			append_dev(span, p0);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(div0, t5);
    			append_dev(div0, p2);
    			append_dev(div0, t7);
    			append_dev(div0, p3);
    			append_dev(div0, t9);
    			append_dev(div0, p4);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, h51);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p5, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p6, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BoxOffice', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BoxOffice> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class BoxOffice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BoxOffice",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/Component/Map/FindMyLocation.svelte generated by Svelte v3.53.1 */

    const { console: console_1$2 } = globals;
    const file$9 = "src/Component/Map/FindMyLocation.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "현재위치 찾기";
    			add_location(button, file$9, 50, 4, 1466);
    			add_location(div, file$9, 49, 0, 1456);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*findMyLocation*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FindMyLocation', slots, []);
    	let { map } = $$props;

    	function findMyLocation() {
    		console.log("현재위치 찾기 버튼 눌림");
    		navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
    	}

    	function onSuccessGeolocation() {
    		// GeoLocation을 이용해서 접속 위치를 얻어옵니다
    		let lat = position.coords.latitude; // 위도

    		let lon = position.coords.longitude; // 경도
    		let locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
    		let message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다
    		displayMarker(locPosition, message); // 마커와 인포윈도우를 표시합니다
    	}

    	function onErrorGeolocation() {
    		let locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
    		let message = '위치를 찾지 못했어요...';
    		displayMarker(locPosition, message);
    	}

    	function displayMarker(locPosition, message) {
    		// 지도에 마커와 인포윈도우를 표시하는 함수
    		// 마커를 생성합니다
    		var marker = new kakao.maps.Marker({ map, position: locPosition });

    		var iwContent = message, iwRemoveable = true; // 인포윈도우에 표시할 내용

    		// 인포윈도우를 생성합니다
    		var infowindow = new kakao.maps.InfoWindow({
    				content: iwContent,
    				removable: iwRemoveable
    			});

    		// 인포윈도우를 마커위에 표시합니다 
    		infowindow.open(map, marker);

    		// 지도 중심좌표를 접속위치로 변경합니다
    		map.setCenter(locPosition);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (map === undefined && !('map' in $$props || $$self.$$.bound[$$self.$$.props['map']])) {
    			console_1$2.warn("<FindMyLocation> was created without expected prop 'map'");
    		}
    	});

    	const writable_props = ['map'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<FindMyLocation> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('map' in $$props) $$invalidate(1, map = $$props.map);
    	};

    	$$self.$capture_state = () => ({
    		map,
    		findMyLocation,
    		onSuccessGeolocation,
    		onErrorGeolocation,
    		displayMarker
    	});

    	$$self.$inject_state = $$props => {
    		if ('map' in $$props) $$invalidate(1, map = $$props.map);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [findMyLocation, map];
    }

    class FindMyLocation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { map: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FindMyLocation",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get map() {
    		throw new Error("<FindMyLocation>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set map(value) {
    		throw new Error("<FindMyLocation>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    //store writable로 map 리턴


    function setNewMap() {
        let mapOption = { //지도 생성 전 초기 설정
            center: new kakao.maps.LatLng(36.635,127.4869444), //지도의 초기위치(CGV 청주서문)
            level: 5 //지도 확대 정도
        };
        
        function addMap() {
            const mapContainer = document.querySelector("#map-container");
            console.log(mapContainer);
            new kakao.maps.Map(mapContainer, mapOption);
        }


        return {
            addMap
        } //새로운 지도 객체 생성하여 리턴
    }

    const map = setNewMap();

    // 메소드 셋맵 -> 카카오맵 생성 후 리턴

    /* src/Component/Map/SearchLocation.svelte generated by Svelte v3.53.1 */

    const { console: console_1$1 } = globals;
    const file$8 = "src/Component/Map/SearchLocation.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let input;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "주소 검색";
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "주소 입력");
    			add_location(input, file$8, 10, 4, 184);
    			add_location(button, file$8, 11, 4, 254);
    			add_location(div, file$8, 9, 0, 174);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*searchValue*/ ctx[0]);
    			append_dev(div, t0);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[1]),
    					listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*searchValue*/ 1 && input.value !== /*searchValue*/ ctx[0]) {
    				set_input_value(input, /*searchValue*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchLocation', slots, []);
    	const btnSearchLocation = document.querySelector("button#loc-search");
    	console.log(map);
    	let searchValue;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<SearchLocation> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		searchValue = this.value;
    		$$invalidate(0, searchValue);
    	}

    	const click_handler = () => {
    		map.searchLocation(searchValue);
    	};

    	$$self.$capture_state = () => ({ map, btnSearchLocation, searchValue });

    	$$self.$inject_state = $$props => {
    		if ('searchValue' in $$props) $$invalidate(0, searchValue = $$props.searchValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [searchValue, input_input_handler, click_handler];
    }

    class SearchLocation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchLocation",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/Component/Map/SetMap.svelte generated by Svelte v3.53.1 */
    const file$7 = "src/Component/Map/SetMap.svelte";

    function create_fragment$8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", "map-container");
    			attr_dev(div, "class", "svelte-s1azis");
    			add_location(div, file$7, 32, 0, 885);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[2](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[2](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SetMap', slots, []);
    	let { map } = $$props;
    	let mapContainer;
    	let locPosition = new kakao.maps.LatLng(36.635, 127.4869444);
    	let imageSrc = './img/marker/megabox_marker.png'; // 마커이미지의 주소입니다    
    	let imageSize = new kakao.maps.Size(48, 48); // 마커이미지의 크기입니다
    	let imageOption = { offset: new kakao.maps.Point(24, 48) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
    	let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    	onMount(() => {
    		let mapOption = {
    			//지도 생성 전 초기 설정
    			center: new kakao.maps.LatLng(36.635, 127.4869444), //지도의 초기위치(CGV 청주서문)
    			level: 5, //지도 확대 정도
    			
    		};

    		$$invalidate(1, map = new kakao.maps.Map(mapContainer, mapOption));
    	});

    	$$self.$$.on_mount.push(function () {
    		if (map === undefined && !('map' in $$props || $$self.$$.bound[$$self.$$.props['map']])) {
    			console.warn("<SetMap> was created without expected prop 'map'");
    		}
    	});

    	const writable_props = ['map'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SetMap> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			mapContainer = $$value;
    			$$invalidate(0, mapContainer);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('map' in $$props) $$invalidate(1, map = $$props.map);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		map,
    		mapContainer,
    		locPosition,
    		imageSrc,
    		imageSize,
    		imageOption,
    		markerImage
    	});

    	$$self.$inject_state = $$props => {
    		if ('map' in $$props) $$invalidate(1, map = $$props.map);
    		if ('mapContainer' in $$props) $$invalidate(0, mapContainer = $$props.mapContainer);
    		if ('locPosition' in $$props) locPosition = $$props.locPosition;
    		if ('imageSrc' in $$props) imageSrc = $$props.imageSrc;
    		if ('imageSize' in $$props) imageSize = $$props.imageSize;
    		if ('imageOption' in $$props) imageOption = $$props.imageOption;
    		if ('markerImage' in $$props) markerImage = $$props.markerImage;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mapContainer, map, div_binding];
    }

    class SetMap extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { map: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetMap",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get map() {
    		throw new Error("<SetMap>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set map(value) {
    		throw new Error("<SetMap>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Component/Map/SetMarker.svelte generated by Svelte v3.53.1 */

    const { console: console_1 } = globals;
    const file$6 = "src/Component/Map/SetMarker.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (148:4) {#each list as theater}
    function create_each_block$1(ctx) {
    	let div;
    	let h4;
    	let t0_value = /*theater*/ ctx[17].name + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*theater*/ ctx[17].address + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			add_location(h4, file$6, 149, 8, 5395);
    			add_location(p, file$6, 150, 8, 5427);
    			add_location(div, file$6, 148, 4, 5381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(h4, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    			append_dev(div, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*list*/ 2 && t0_value !== (t0_value = /*theater*/ ctx[17].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*list*/ 2 && t2_value !== (t2_value = /*theater*/ ctx[17].address + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(148:4) {#each list as theater}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let h3;
    	let t0_value = /*selectedTheater*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let h4;
    	let t2_value = /*selectedTheater*/ ctx[0].address + "";
    	let t2;
    	let t3;
    	let t4;
    	let div2;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*list*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			h4 = element("h4");
    			t2 = text(t2_value);
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "위도 경도 새로 구하기12";
    			add_location(h3, file$6, 144, 8, 5263);
    			add_location(h4, file$6, 145, 8, 5303);
    			attr_dev(div0, "id", "selected-theater");
    			attr_dev(div0, "class", "svelte-266wfg");
    			add_location(div0, file$6, 143, 4, 5227);
    			add_location(div1, file$6, 142, 0, 5217);
    			add_location(button, file$6, 155, 4, 5492);
    			add_location(div2, file$6, 154, 0, 5482);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(div0, t1);
    			append_dev(div0, h4);
    			append_dev(h4, t2);
    			append_dev(div1, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selectedTheater*/ 1 && t0_value !== (t0_value = /*selectedTheater*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*selectedTheater*/ 1 && t2_value !== (t2_value = /*selectedTheater*/ ctx[0].address + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*list*/ 2) {
    				each_value = /*list*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let list;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SetMarker', slots, []);
    	let { map } = $$props;
    	const theaters = [];
    	let selectedTheater = {};
    	let geocoder = new kakao.maps.services.Geocoder();
    	let markerSize = new kakao.maps.Size(48, 48);
    	let markerOption = { offset: new kakao.maps.Point(24, 48) };
    	let cgvMarker = new kakao.maps.MarkerImage('./img/marker/cgv_marker.png', markerSize, markerOption);
    	let cgv4dxMarker = new kakao.maps.MarkerImage('./img/marker/cgv_4dx_marker.png', markerSize, markerOption);
    	let cgvImaxMarker = new kakao.maps.MarkerImage('./img/marker/cgv_imax_marker.png', markerSize, markerOption);
    	let lotteMarker = new kakao.maps.MarkerImage('./img/marker/lottecinema_marker.png', markerSize, markerOption);
    	let megaboxMarker = new kakao.maps.MarkerImage('./img/marker/megabox_marker.png', markerSize, markerOption);
    	let otherMarker = new kakao.maps.MarkerImage('./img/marker/other_marker.png', markerSize, markerOption);

    	function setImg(theater) {
    		switch (theater.company) {
    			case 'CJ올리브네트웍스(주)':
    				if (theater.countImax > 0) {
    					console.log(theater);
    					return cgvImaxMarker;
    				} else if (theater.count4d > 0) {
    					return cgv4dxMarker;
    				} else {
    					return cgvMarker;
    				}
    			case '롯데컬처웍스(주)롯데시네마':
    				return lotteMarker;
    			case '메가박스(주)':
    				return megaboxMarker;
    			default:
    				return otherMarker;
    		}
    	}

    	async function getTheaterList() {
    		const response = await fetch('/theater');
    		const result = await response.json();

    		new kakao.maps.MarkerClusterer({
    				map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    				averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    				minLevel: 10, // 클러스터 할 최소 지도 레벨 
    				
    			});

    		result.forEach(theater => {
    			if (theater.name === /./g) if (theater.latitude === null || theater.longitude === null) {
    				setCoords(theater.address, theater.code);

    				if (theater.latitude === null || theater.longitude === null) {
    					const newAddress = theater.address.match(/.+(?=번지)/g);
    					setCoords(newAddress, theater.code);
    				}
    			}

    			let coords = new kakao.maps.LatLng(theater.latitude, theater.longitude);

    			let marker = new kakao.maps.Marker({
    					map,
    					position: coords,
    					image: setImg(theater)
    				});

    			let infowindow = new kakao.maps.InfoWindow({ content: theater.name, removable: false });

    			kakao.maps.event.addListener(marker, 'mouseover', () => {
    				infowindow.open(map, marker);
    			});

    			kakao.maps.event.addListener(marker, 'mouseout', () => {
    				infowindow.close();
    			});

    			kakao.maps.event.addListener(marker, 'click', () => {
    				console.log(theater);
    				$$invalidate(0, selectedTheater = theater);
    			});

    			theater.marker = marker;
    			theaters.push(theater);
    		}); // clusterer.addMarker(marker);

    		kakao.maps.event.addListener(map, 'dragend', setMarkerList);
    		kakao.maps.event.addListener(map, 'zoom_changed', setMarkerList);

    		function setMarkerList() {
    			let bounds = map.getBounds();
    			const latMin = bounds.getSouthWest().getLat();
    			const lngMin = bounds.getSouthWest().getLng();
    			const latMax = bounds.getNorthEast().getLat();
    			const lngMax = bounds.getNorthEast().getLng();
    			const listTheater = [];
    			console.log("map changed");

    			theaters.forEach(theater => {
    				const lat = theater.marker.getPosition().getLat();
    				const lng = theater.marker.getPosition().getLng();

    				if (lat > latMin && lat < latMax && lng > lngMin && lng < lngMax) {
    					listTheater.push(theater);
    					console.log(listTheater);
    				}
    			});

    			$$invalidate(1, list = listTheater);
    		}
    	}

    	function setCoords(address, code) {
    		geocoder.addressSearch(address, (result, status) => {
    			if (status === kakao.maps.services.Status.OK) {
    				console.log(result[0].y);
    				console.log(result[0].x);
    				console.log(code);

    				fetch('/setcoords', {
    					method: "PUT",
    					headers: { "Content-Type": "application/json" },
    					body: JSON.stringify({
    						latitude: result[0].y,
    						longitude: result[0].x,
    						code
    					})
    				});
    			}
    		});
    	}

    	getTheaterList();

    	$$self.$$.on_mount.push(function () {
    		if (map === undefined && !('map' in $$props || $$self.$$.bound[$$self.$$.props['map']])) {
    			console_1.warn("<SetMarker> was created without expected prop 'map'");
    		}
    	});

    	const writable_props = ['map'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<SetMarker> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		getTheaterList();
    	};

    	$$self.$$set = $$props => {
    		if ('map' in $$props) $$invalidate(3, map = $$props.map);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		map,
    		theaters,
    		selectedTheater,
    		geocoder,
    		markerSize,
    		markerOption,
    		cgvMarker,
    		cgv4dxMarker,
    		cgvImaxMarker,
    		lotteMarker,
    		megaboxMarker,
    		otherMarker,
    		setImg,
    		getTheaterList,
    		setCoords,
    		list
    	});

    	$$self.$inject_state = $$props => {
    		if ('map' in $$props) $$invalidate(3, map = $$props.map);
    		if ('selectedTheater' in $$props) $$invalidate(0, selectedTheater = $$props.selectedTheater);
    		if ('geocoder' in $$props) geocoder = $$props.geocoder;
    		if ('markerSize' in $$props) markerSize = $$props.markerSize;
    		if ('markerOption' in $$props) markerOption = $$props.markerOption;
    		if ('cgvMarker' in $$props) cgvMarker = $$props.cgvMarker;
    		if ('cgv4dxMarker' in $$props) cgv4dxMarker = $$props.cgv4dxMarker;
    		if ('cgvImaxMarker' in $$props) cgvImaxMarker = $$props.cgvImaxMarker;
    		if ('lotteMarker' in $$props) lotteMarker = $$props.lotteMarker;
    		if ('megaboxMarker' in $$props) megaboxMarker = $$props.megaboxMarker;
    		if ('otherMarker' in $$props) otherMarker = $$props.otherMarker;
    		if ('list' in $$props) $$invalidate(1, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(1, list = []);
    	return [selectedTheater, list, getTheaterList, map, click_handler];
    }

    class SetMarker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { map: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetMarker",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get map() {
    		throw new Error("<SetMarker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set map(value) {
    		throw new Error("<SetMarker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Component/Map/Map.svelte generated by Svelte v3.53.1 */
    const file$5 = "src/Component/Map/Map.svelte";

    function create_fragment$6(ctx) {
    	let p;
    	let t1;
    	let div;
    	let setmap;
    	let updating_map;
    	let t2;
    	let setmarker;
    	let updating_map_1;
    	let t3;
    	let findmylocation;
    	let updating_map_2;
    	let current;

    	function setmap_map_binding(value) {
    		/*setmap_map_binding*/ ctx[1](value);
    	}

    	let setmap_props = {};

    	if (/*map*/ ctx[0] !== void 0) {
    		setmap_props.map = /*map*/ ctx[0];
    	}

    	setmap = new SetMap({ props: setmap_props, $$inline: true });
    	binding_callbacks.push(() => bind(setmap, 'map', setmap_map_binding));

    	function setmarker_map_binding(value) {
    		/*setmarker_map_binding*/ ctx[2](value);
    	}

    	let setmarker_props = {};

    	if (/*map*/ ctx[0] !== void 0) {
    		setmarker_props.map = /*map*/ ctx[0];
    	}

    	setmarker = new SetMarker({ props: setmarker_props, $$inline: true });
    	binding_callbacks.push(() => bind(setmarker, 'map', setmarker_map_binding));

    	function findmylocation_map_binding(value) {
    		/*findmylocation_map_binding*/ ctx[3](value);
    	}

    	let findmylocation_props = {};

    	if (/*map*/ ctx[0] !== void 0) {
    		findmylocation_props.map = /*map*/ ctx[0];
    	}

    	findmylocation = new FindMyLocation({
    			props: findmylocation_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(findmylocation, 'map', findmylocation_map_binding));

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "hello";
    			t1 = space();
    			div = element("div");
    			create_component(setmap.$$.fragment);
    			t2 = space();
    			create_component(setmarker.$$.fragment);
    			t3 = space();
    			create_component(findmylocation.$$.fragment);
    			add_location(p, file$5, 8, 0, 219);
    			add_location(div, file$5, 9, 4, 236);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(setmap, div, null);
    			append_dev(div, t2);
    			mount_component(setmarker, div, null);
    			append_dev(div, t3);
    			mount_component(findmylocation, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const setmap_changes = {};

    			if (!updating_map && dirty & /*map*/ 1) {
    				updating_map = true;
    				setmap_changes.map = /*map*/ ctx[0];
    				add_flush_callback(() => updating_map = false);
    			}

    			setmap.$set(setmap_changes);
    			const setmarker_changes = {};

    			if (!updating_map_1 && dirty & /*map*/ 1) {
    				updating_map_1 = true;
    				setmarker_changes.map = /*map*/ ctx[0];
    				add_flush_callback(() => updating_map_1 = false);
    			}

    			setmarker.$set(setmarker_changes);
    			const findmylocation_changes = {};

    			if (!updating_map_2 && dirty & /*map*/ 1) {
    				updating_map_2 = true;
    				findmylocation_changes.map = /*map*/ ctx[0];
    				add_flush_callback(() => updating_map_2 = false);
    			}

    			findmylocation.$set(findmylocation_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setmap.$$.fragment, local);
    			transition_in(setmarker.$$.fragment, local);
    			transition_in(findmylocation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setmap.$$.fragment, local);
    			transition_out(setmarker.$$.fragment, local);
    			transition_out(findmylocation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(setmap);
    			destroy_component(setmarker);
    			destroy_component(findmylocation);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Map', slots, []);
    	let map;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	function setmap_map_binding(value) {
    		map = value;
    		$$invalidate(0, map);
    	}

    	function setmarker_map_binding(value) {
    		map = value;
    		$$invalidate(0, map);
    	}

    	function findmylocation_map_binding(value) {
    		map = value;
    		$$invalidate(0, map);
    	}

    	$$self.$capture_state = () => ({
    		FindMyLocation,
    		SearchLocation,
    		SetMap,
    		SetMarker,
    		map
    	});

    	$$self.$inject_state = $$props => {
    		if ('map' in $$props) $$invalidate(0, map = $$props.map);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [map, setmap_map_binding, setmarker_map_binding, findmylocation_map_binding];
    }

    class Map$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Map",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/Component/MovieCard/MovieCard.svelte generated by Svelte v3.53.1 */
    const file$4 = "src/Component/MovieCard/MovieCard.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let dl;
    	let h5;
    	let t1_value = /*data*/ ctx[0].title + "";
    	let t1;
    	let dd0;
    	let t2_value = /*data*/ ctx[0].year + "";
    	let t2;
    	let t3;
    	let dd1;
    	let t4_value = /*data*/ ctx[0].comment + "";
    	let t4;
    	let div2_intro;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			dl = element("dl");
    			h5 = element("h5");
    			t1 = text(t1_value);
    			dd0 = element("dd");
    			t2 = text(t2_value);
    			t3 = text("년 개봉");
    			dd1 = element("dd");
    			t4 = text(t4_value);
    			attr_dev(img, "class", "movie-img");
    			if (!src_url_equal(img.src, img_src_value = /*data*/ ctx[0].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "이미지 불러오기 실패");
    			set_style(img, "width", "100%");
    			add_location(img, file$4, 39, 8, 1507);
    			add_location(div0, file$4, 38, 4, 1493);
    			attr_dev(h5, "class", "movie-title");
    			add_location(h5, file$4, 43, 12, 1681);
    			attr_dev(dd0, "class", "movie-year");
    			add_location(dd0, file$4, 44, 12, 1735);
    			attr_dev(dd1, "class", "movie-comment");
    			add_location(dd1, file$4, 45, 12, 1791);
    			attr_dev(dl, "class", "uk-description-list");
    			add_location(dl, file$4, 42, 8, 1636);
    			attr_dev(div1, "class", "uk-card-body");
    			add_location(div1, file$4, 41, 4, 1601);
    			attr_dev(div2, "class", "uk-card uk-card-default movie-card");
    			add_location(div2, file$4, 37, 0, 1432);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, dl);
    			append_dev(dl, h5);
    			append_dev(h5, t1);
    			append_dev(dl, dd0);
    			append_dev(dd0, t2);
    			append_dev(dd0, t3);
    			append_dev(dl, dd1);
    			append_dev(dd1, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && !src_url_equal(img.src, img_src_value = /*data*/ ctx[0].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*data*/ 1 && t1_value !== (t1_value = /*data*/ ctx[0].title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*data*/ 1 && t2_value !== (t2_value = /*data*/ ctx[0].year + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*data*/ 1 && t4_value !== (t4_value = /*data*/ ctx[0].comment + "")) set_data_dev(t4, t4_value);
    		},
    		i: function intro(local) {
    			if (!div2_intro) {
    				add_render_callback(() => {
    					div2_intro = create_in_transition(div2, fade, {});
    					div2_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getColorData(color) {
    	// rgb 배열을 rgba문자열, 밝기값을 포함한 객체로 배열 color = [R, G, B] -> rbga(R,G,B);
    	return {
    		rgb: "rgba(" + color[0] + "," + color[1] + "," + color[2] + ")", // [255, 255, 255] -> "rgba(255,255,255)"
    		luma: 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2]
    	};
    }

    function getGamma(color1, color2) {
    	// 두 색상의 밝기 (luma) 차이 절댓값을 반환
    	return Math.abs(getColorData(color1).luma - getColorData(color2).luma);
    }

    function setColor(card) {
    	const colorThief = new ColorThief();
    	const movieImg = card.querySelector(".movie-img");
    	const bg = colorThief.getColor(movieImg);

    	let titleColor = getColorData(colorThief.getPalette(movieImg).reduce((p, c) => {
    		//컬러 팔레트의 색상을 하나씩 순차적으로 비교 
    		return getGamma(bg, p) > getGamma(bg, c) ? p : c; // 감마 차이가 더 큰 값을 리턴하여 배열의 다음 값과 비교
    	}));

    	card.style.backgroundColor = getColorData(bg).rgb;
    	card.querySelector(".movie-title").style.color = titleColor.rgb;
    	card.querySelector(".movie-year").style.color = titleColor.rgb;
    	card.querySelector(".movie-comment").style.color = titleColor.rgb;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MovieCard', slots, []);
    	let { data } = $$props;

    	window.onload = () => {
    		const cards = document.querySelectorAll(".movie-card");
    		cards.forEach(card => setColor(card));
    	};

    	$$self.$$.on_mount.push(function () {
    		if (data === undefined && !('data' in $$props || $$self.$$.bound[$$self.$$.props['data']])) {
    			console.warn("<MovieCard> was created without expected prop 'data'");
    		}
    	});

    	const writable_props = ['data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MovieCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		data,
    		getColorData,
    		getGamma,
    		setColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class MovieCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MovieCard",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get data() {
    		throw new Error("<MovieCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<MovieCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Component/MovieCard/MovieCards.svelte generated by Svelte v3.53.1 */
    const file$3 = "src/Component/MovieCard/MovieCards.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (40:4) {#each datas as data}
    function create_each_block(ctx) {
    	let div;
    	let moviecard;
    	let t;
    	let current;

    	moviecard = new MovieCard({
    			props: { data: /*data*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(moviecard.$$.fragment);
    			t = space();
    			add_location(div, file$3, 40, 8, 1095);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(moviecard, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(moviecard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(moviecard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(moviecard);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(40:4) {#each datas as data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	let each_value = /*datas*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "lists");
    			attr_dev(div, "class", "uk-grid-column-small uk-grid-row-small uk-child-width-1-2 uk-child-width-1-3@m uk-child-width-1-5@l uk-child-width-1-6@xl");
    			attr_dev(div, "uk-grid", "masonry: true");
    			add_location(div, file$3, 38, 0, 890);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*datas*/ 1) {
    				each_value = /*datas*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MovieCards', slots, []);
    	const movieCardList = [];

    	const datas = [
    		{
    			title: "그랜드 부다페스트 호텔",
    			year: 2017,
    			comment: "영상미 엄청남",
    			img: "./img/sample-budapest.jpeg"
    		},
    		{
    			title: "헤어질 결심",
    			year: 2022,
    			comment: "칸 영화제 감독상",
    			img: "./img/sample-park.jpeg"
    		},
    		{
    			title: "듄",
    			year: 2021,
    			comment: "드니 빌뇌브 감독",
    			img: "./img/sample-dune.jpeg"
    		},
    		{
    			title: "스타 이즈 본",
    			year: 2020,
    			comment: "브래들리 쿠퍼 감독",
    			img: "./img/sample-starisborn.jpg"
    		},
    		{
    			title: "미드나잇 인 파리",
    			year: 2014,
    			comment: "우디 앨런 감독",
    			img: "./img/sample-paris.jpeg"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MovieCards> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ MovieCard, movieCardList, datas });
    	return [datas];
    }

    class MovieCards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MovieCards",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Component/Nav/SideNav.svelte generated by Svelte v3.53.1 */

    const file$2 = "src/Component/Nav/SideNav.svelte";

    function create_fragment$3(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t1;
    	let ul1;
    	let li0;
    	let a0;
    	let t3;
    	let li3;
    	let a1;
    	let t4;
    	let span0;
    	let t5;
    	let ul0;
    	let li1;
    	let a2;
    	let t7;
    	let li2;
    	let a3;
    	let t9;
    	let li4;
    	let t10;
    	let li5;
    	let t12;
    	let li6;
    	let a4;
    	let span1;
    	let t13;
    	let t14;
    	let li7;
    	let a5;
    	let span2;
    	let t15;
    	let li8;
    	let a6;
    	let span3;
    	let t16;
    	let t17;
    	let li9;
    	let a7;
    	let span4;
    	let t18;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "프로필사진, 닉네임, 마이페이지 링크";
    			t1 = space();
    			ul1 = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "예시";
    			t3 = space();
    			li3 = element("li");
    			a1 = element("a");
    			t4 = text("게시판");
    			span0 = element("span");
    			t5 = space();
    			ul0 = element("ul");
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "리뷰 게시판..?";
    			t7 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "자유 게시판???";
    			t9 = space();
    			li4 = element("li");
    			t10 = space();
    			li5 = element("li");
    			li5.textContent = "기능들~_~";
    			t12 = space();
    			li6 = element("li");
    			a4 = element("a");
    			span1 = element("span");
    			t13 = text("게시물 보기");
    			t14 = space();
    			li7 = element("li");
    			a5 = element("a");
    			span2 = element("span");
    			t15 = space();
    			li8 = element("li");
    			a6 = element("a");
    			span3 = element("span");
    			t16 = text("근처 영화관 찾기");
    			t17 = space();
    			li9 = element("li");
    			a7 = element("a");
    			span4 = element("span");
    			t18 = text(" Item");
    			add_location(div0, file$2, 2, 8, 160);
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$2, 6, 34, 308);
    			attr_dev(li0, "class", "uk-active");
    			add_location(li0, file$2, 6, 12, 286);
    			attr_dev(span0, "uk-nav-parent-icon", "");
    			add_location(span0, file$2, 8, 31, 398);
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$2, 8, 16, 383);
    			attr_dev(a2, "href", "#");
    			add_location(a2, file$2, 10, 24, 499);
    			add_location(li1, file$2, 10, 20, 495);
    			attr_dev(a3, "href", "#");
    			add_location(a3, file$2, 11, 24, 554);
    			add_location(li2, file$2, 11, 20, 550);
    			attr_dev(ul0, "class", "uk-nav-sub");
    			add_location(ul0, file$2, 9, 16, 451);
    			attr_dev(li3, "class", "uk-parent");
    			add_location(li3, file$2, 7, 12, 344);
    			attr_dev(li4, "class", "uk-nav-divider");
    			add_location(li4, file$2, 14, 12, 637);
    			attr_dev(li5, "class", "uk-nav-header");
    			add_location(li5, file$2, 15, 12, 682);
    			attr_dev(span1, "class", "uk-margin-small-right");
    			attr_dev(span1, "uk-icon", "icon: table");
    			add_location(span1, file$2, 16, 28, 748);
    			attr_dev(a4, "href", "#");
    			add_location(a4, file$2, 16, 16, 736);
    			add_location(li6, file$2, 16, 12, 732);
    			attr_dev(span2, "class", "uk-margin-small-right");
    			attr_dev(span2, "uk-icon", "icon: thumbnails");
    			add_location(span2, file$2, 17, 28, 857);
    			attr_dev(a5, "href", "#");
    			add_location(a5, file$2, 17, 16, 845);
    			add_location(li7, file$2, 17, 12, 841);
    			attr_dev(span3, "class", "uk-margin-small-right");
    			attr_dev(span3, "uk-icon", "icon: thumbnails");
    			add_location(span3, file$2, 18, 28, 965);
    			attr_dev(a6, "href", "#");
    			add_location(a6, file$2, 18, 16, 953);
    			add_location(li8, file$2, 18, 12, 949);
    			attr_dev(span4, "class", "uk-margin-small-right");
    			attr_dev(span4, "uk-icon", "icon: trash");
    			add_location(span4, file$2, 19, 28, 1082);
    			attr_dev(a7, "href", "#");
    			add_location(a7, file$2, 19, 16, 1070);
    			add_location(li9, file$2, 19, 12, 1066);
    			attr_dev(ul1, "class", "uk-nav-default uk-padding-small");
    			attr_dev(ul1, "uk-nav", "");
    			add_location(ul1, file$2, 5, 8, 222);
    			attr_dev(div1, "class", "uk-width-1-1 uk-card uk-card-default");
    			attr_dev(div1, "uk-sticky", "offset: 20; media: @m");
    			add_location(div1, file$2, 1, 4, 67);
    			attr_dev(div2, "class", "uk-width-medium@m uk-width-1-1 uk-padding-small");
    			add_location(div2, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, ul1);
    			append_dev(ul1, li0);
    			append_dev(li0, a0);
    			append_dev(ul1, t3);
    			append_dev(ul1, li3);
    			append_dev(li3, a1);
    			append_dev(a1, t4);
    			append_dev(a1, span0);
    			append_dev(li3, t5);
    			append_dev(li3, ul0);
    			append_dev(ul0, li1);
    			append_dev(li1, a2);
    			append_dev(ul0, t7);
    			append_dev(ul0, li2);
    			append_dev(li2, a3);
    			append_dev(ul1, t9);
    			append_dev(ul1, li4);
    			append_dev(ul1, t10);
    			append_dev(ul1, li5);
    			append_dev(ul1, t12);
    			append_dev(ul1, li6);
    			append_dev(li6, a4);
    			append_dev(a4, span1);
    			append_dev(a4, t13);
    			append_dev(ul1, t14);
    			append_dev(ul1, li7);
    			append_dev(li7, a5);
    			append_dev(a5, span2);
    			append_dev(ul1, t15);
    			append_dev(ul1, li8);
    			append_dev(li8, a6);
    			append_dev(a6, span3);
    			append_dev(a6, t16);
    			append_dev(ul1, t17);
    			append_dev(ul1, li9);
    			append_dev(li9, a7);
    			append_dev(a7, span4);
    			append_dev(a7, t18);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideNav', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SideNav> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SideNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNav",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Component/Layout/Content.svelte generated by Svelte v3.53.1 */
    const file$1 = "src/Component/Layout/Content.svelte";

    // (19:4) {:else}
    function create_else_block(ctx) {
    	let map;
    	let current;
    	map = new Map$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(map.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(map, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(map.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(map.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(map, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(19:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if viewMode === 'sns'}
    function create_if_block(ctx) {
    	let boxoffice;
    	let t;
    	let moviecards;
    	let current;
    	boxoffice = new BoxOffice({ $$inline: true });
    	moviecards = new MovieCards({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(boxoffice.$$.fragment);
    			t = space();
    			create_component(moviecards.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(boxoffice, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(moviecards, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(boxoffice.$$.fragment, local);
    			transition_in(moviecards.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(boxoffice.$$.fragment, local);
    			transition_out(moviecards.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(boxoffice, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(moviecards, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:4) {#if viewMode === 'sns'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let sidenav;
    	let t0;
    	let div1;
    	let div0;
    	let h3;
    	let t2;
    	let button0;
    	let t4;
    	let button1;
    	let t6;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	sidenav = new SideNav({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*viewMode*/ ctx[0] === 'sns') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(sidenav.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			h3.textContent = "테스트용";
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "sns페이지 보기";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "지도페이지 보기";
    			t6 = space();
    			if_block.c();
    			add_location(h3, file$1, 11, 8, 337);
    			add_location(button0, file$1, 12, 8, 359);
    			add_location(button1, file$1, 13, 8, 430);
    			add_location(div0, file$1, 10, 4, 323);
    			attr_dev(div1, "class", "uk-width-1-1 uk-width-expand@s uk-padding-small");
    			add_location(div1, file$1, 9, 0, 257);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidenav, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(div0, t2);
    			append_dev(div0, button0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			append_dev(div1, t6);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenav.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenav.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidenav, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, []);
    	let viewMode = 'map';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, viewMode = 'sns');
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, viewMode = 'map');
    	};

    	$$self.$capture_state = () => ({
    		BoxOffice,
    		Map: Map$1,
    		MovieCards,
    		SideNav,
    		viewMode
    	});

    	$$self.$inject_state = $$props => {
    		if ('viewMode' in $$props) $$invalidate(0, viewMode = $$props.viewMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [viewMode, click_handler, click_handler_1];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Component/Layout/Main.svelte generated by Svelte v3.53.1 */
    const file = "src/Component/Layout/Main.svelte";

    function create_fragment$1(ctx) {
    	let link0;
    	let link1;
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let t0;
    	let div0;
    	let h2;
    	let t2;
    	let div1;
    	let content;
    	let current;
    	content = new Content({ $$inline: true });

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			script0 = element("script");
    			script1 = element("script");
    			t0 = space();
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "My Cinema";
    			t2 = space();
    			div1 = element("div");
    			create_component(content.$$.fragment);
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "href", "https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/css/uikit.min.css");
    			add_location(link0, file, 6, 0, 79);
    			attr_dev(link1, "href", "https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css");
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "type", "text/css");
    			add_location(link1, file, 7, 0, 178);
    			if (!src_url_equal(script0.src, script0_src_value = "https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit.min.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file, 9, 0, 294);
    			if (!src_url_equal(script1.src, script1_src_value = "https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit-icons.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file, 10, 0, 382);
    			set_style(h2, "color", "#FFFFFF");
    			add_location(h2, file, 16, 4, 550);
    			set_style(div0, "background-color", "#282828");
    			set_style(div0, "height", "64px");
    			add_location(div0, file, 15, 0, 494);
    			attr_dev(div1, "uk-grid", "");
    			attr_dev(div1, "class", "uk-grid-collapse");
    			add_location(div1, file, 18, 0, 598);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h2);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(content, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			detach_dev(script0);
    			detach_dev(script1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			destroy_component(content);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Content });
    	return [];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.53.1 */

    function create_fragment(ctx) {
    	let main;
    	let current;
    	main = new Main({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(main.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(main, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(main, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	});

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ Main, name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
