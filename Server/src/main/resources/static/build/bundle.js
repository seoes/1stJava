
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
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
    function empty() {
        return text('');
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
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    /**
     * Checks whether a given `key` has been set in the context of a parent component.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-hascontext
     */
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
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
    function tick() {
        schedule_update();
        return resolved_promise;
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

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
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

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function p(e,a=!1){return e=e.slice(e.startsWith("/#")?2:0,e.endsWith("/*")?-2:void 0),e.startsWith("/")||(e="/"+e),e==="/"&&(e=""),a&&!e.endsWith("/")&&(e+="/"),e}function d(e,a){e=p(e,!0),a=p(a,!0);let r=[],n={},t=!0,s=e.split("/").map(o=>o.startsWith(":")?(r.push(o.slice(1)),"([^\\/]+)"):o).join("\\/"),c=a.match(new RegExp(`^${s}$`));return c||(t=!1,c=a.match(new RegExp(`^${s}`))),c?(r.forEach((o,h)=>n[o]=c[h+1]),{exact:t,params:n,part:c[0].slice(0,-1)}):null}function x(e,a,r){if(r==="")return e;if(r[0]==="/")return r;let n=c=>c.split("/").filter(o=>o!==""),t=n(e),s=a?n(a):[];return "/"+s.map((c,o)=>t[o]).join("/")+"/"+r}function m(e,a,r,n){let t=[a,"data-"+a].reduce((s,c)=>{let o=e.getAttribute(c);return r&&e.removeAttribute(c),o===null?s:o},!1);return !n&&t===""?!0:t||n||!1}function S(e){let a=e.split("&").map(r=>r.split("=")).reduce((r,n)=>{let t=n[0];if(!t)return r;let s=n.length>1?n[n.length-1]:!0;return typeof s=="string"&&s.includes(",")&&(s=s.split(",")),r[t]===void 0?r[t]=[s]:r[t].push(s),r},{});return Object.entries(a).reduce((r,n)=>(r[n[0]]=n[1].length>1?n[1]:n[1][0],r),{})}function M(e){return Object.entries(e).map(([a,r])=>r?r===!0?a:`${a}=${Array.isArray(r)?r.join(","):r}`:null).filter(a=>a).join("&")}function w(e,a){return e?a+e:""}function k(e){throw new Error("[Tinro] "+e)}var i={HISTORY:1,HASH:2,MEMORY:3,OFF:4,run(e,a,r,n){return e===this.HISTORY?a&&a():e===this.HASH?r&&r():n&&n()},getDefault(){return !window||window.location.pathname==="srcdoc"?this.MEMORY:this.HISTORY}};var y,$,H,b="",l=E();function E(){let e=i.getDefault(),a,r=c=>window.onhashchange=window.onpopstate=y=null,n=c=>a&&a(R(e)),t=c=>{c&&(e=c),r(),e!==i.OFF&&i.run(e,o=>window.onpopstate=n,o=>window.onhashchange=n)&&n();},s=c=>{let o=Object.assign(R(e),c);return o.path+w(M(o.query),"?")+w(o.hash,"#")};return {mode:t,get:c=>R(e),go(c,o){_(e,c,o),n();},start(c){a=c,t();},stop(){a=null,t(i.OFF);},set(c){this.go(s(c),!c.path);},methods(){return j(this)},base:c=>b=c}}function _(e,a,r){!r&&($=H);let n=t=>history[`${r?"replace":"push"}State`]({},"",t);i.run(e,t=>n(b+a),t=>n(`#${a}`),t=>y=a);}function R(e){let a=window.location,r=i.run(e,t=>(b?a.pathname.replace(b,""):a.pathname)+a.search+a.hash,t=>String(a.hash.slice(1)||"/"),t=>y||"/"),n=r.match(/^([^?#]+)(?:\?([^#]+))?(?:\#(.+))?$/);return H=r,{url:r,from:$,path:n[1]||"",query:S(n[2]||""),hash:n[3]||""}}function j(e){let a=()=>e.get().query,r=c=>e.set({query:c}),n=c=>r(c(a())),t=()=>e.get().hash,s=c=>e.set({hash:c});return {hash:{get:t,set:s,clear:()=>s("")},query:{replace:r,clear:()=>r(""),get(c){return c?a()[c]:a()},set(c,o){n(h=>(h[c]=o,h));},delete(c){n(o=>(o[c]&&delete o[c],o));}}}}var f=T();function T(){let{subscribe:e}=writable(l.get(),a=>{l.start(a);let r=P(l.go);return ()=>{l.stop(),r();}});return {subscribe:e,goto:l.go,params:Q,meta:O,useHashNavigation:a=>l.mode(a?i.HASH:i.HISTORY),mode:{hash:()=>l.mode(i.HASH),history:()=>l.mode(i.HISTORY),memory:()=>l.mode(i.MEMORY)},base:l.base,location:l.methods()}}function P(e){let a=r=>{let n=r.target.closest("a[href]"),t=n&&m(n,"target",!1,"_self"),s=n&&m(n,"tinro-ignore"),c=r.ctrlKey||r.metaKey||r.altKey||r.shiftKey;if(t=="_self"&&!s&&!c&&n){let o=n.getAttribute("href").replace(/^\/#/,"");/^\/\/|^#|^[a-zA-Z]+:/.test(o)||(r.preventDefault(),e(o.startsWith("/")?o:n.href.replace(window.location.origin,"")));}};return addEventListener("click",a),()=>removeEventListener("click",a)}function Q(){return getContext("tinro").meta.params}var g="tinro",K=v({pattern:"",matched:!0});function q(e){let a=getContext(g)||K;(a.exact||a.fallback)&&k(`${e.fallback?"<Route fallback>":`<Route path="${e.path}">`}  can't be inside ${a.fallback?"<Route fallback>":`<Route path="${a.path||"/"}"> with exact path`}`);let r=e.fallback?"fallbacks":"childs",n=writable({}),t=v({fallback:e.fallback,parent:a,update(s){t.exact=!s.path.endsWith("/*"),t.pattern=p(`${t.parent.pattern||""}${s.path}`),t.redirect=s.redirect,t.firstmatch=s.firstmatch,t.breadcrumb=s.breadcrumb,t.match();},register:()=>(t.parent[r].add(t),async()=>{t.parent[r].delete(t),t.parent.activeChilds.delete(t),t.router.un&&t.router.un(),t.parent.match();}),show:()=>{e.onShow(),!t.fallback&&t.parent.activeChilds.add(t);},hide:()=>{e.onHide(),t.parent.activeChilds.delete(t);},match:async()=>{t.matched=!1;let{path:s,url:c,from:o,query:h}=t.router.location,u=d(t.pattern,s);if(!t.fallback&&u&&t.redirect&&(!t.exact||t.exact&&u.exact)){let A=x(s,t.parent.pattern,t.redirect);return f.goto(A,!0)}t.meta=u&&{from:o,url:c,query:h,match:u.part,pattern:t.pattern,breadcrumbs:t.parent.meta&&t.parent.meta.breadcrumbs.slice()||[],params:u.params,subscribe:n.subscribe},t.breadcrumb&&t.meta&&t.meta.breadcrumbs.push({name:t.breadcrumb,path:u.part}),n.set(t.meta),u&&!t.fallback&&(!t.exact||t.exact&&u.exact)&&(!t.parent.firstmatch||!t.parent.matched)?(e.onMeta(t.meta),t.parent.matched=!0,t.show()):t.hide(),u&&t.showFallbacks();}});return setContext(g,t),onMount(()=>t.register()),t}function O(){return hasContext(g)?getContext(g).meta:k("meta() function must be run inside any `<Route>` child component only")}function v(e){let a={router:{},exact:!1,pattern:null,meta:null,parent:null,fallback:!1,redirect:!1,firstmatch:!1,breadcrumb:null,matched:!1,childs:new Set,activeChilds:new Set,fallbacks:new Set,async showFallbacks(){if(!this.fallback&&(await tick(),this.childs.size>0&&this.activeChilds.size==0||this.childs.size==0&&this.fallbacks.size>0)){let r=this;for(;r.fallbacks.size==0;)if(r=r.parent,!r)return;r&&r.fallbacks.forEach(n=>{if(n.redirect){let t=x("/",n.parent.pattern,n.redirect);f.goto(t,!0);}else n.show();});}},start(){this.router.un||(this.router.un=f.subscribe(r=>{this.router.location=r,this.pattern!==null&&this.match();}));},match(){this.showFallbacks();}};return Object.assign(a,e),a.start(),a}

    /* node_modules/tinro/cmp/Route.svelte generated by Svelte v3.53.1 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*params*/ 2,
    	meta: dirty & /*meta*/ 4
    });

    const get_default_slot_context = ctx => ({
    	params: /*params*/ ctx[1],
    	meta: /*meta*/ ctx[2]
    });

    // (33:0) {#if showContent}
    function create_if_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, params, meta*/ 262)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(33:0) {#if showContent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*showContent*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showContent*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showContent*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = '/*' } = $$props;
    	let { fallback = false } = $$props;
    	let { redirect = false } = $$props;
    	let { firstmatch = false } = $$props;
    	let { breadcrumb = null } = $$props;
    	let showContent = false;
    	let params = {}; /* DEPRECATED */
    	let meta = {};

    	const route = q({
    		fallback,
    		onShow() {
    			$$invalidate(0, showContent = true);
    		},
    		onHide() {
    			$$invalidate(0, showContent = false);
    		},
    		onMeta(newmeta) {
    			$$invalidate(2, meta = newmeta);
    			$$invalidate(1, params = meta.params); /* DEPRECATED */
    		}
    	});

    	const writable_props = ['path', 'fallback', 'redirect', 'firstmatch', 'breadcrumb'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('fallback' in $$props) $$invalidate(4, fallback = $$props.fallback);
    		if ('redirect' in $$props) $$invalidate(5, redirect = $$props.redirect);
    		if ('firstmatch' in $$props) $$invalidate(6, firstmatch = $$props.firstmatch);
    		if ('breadcrumb' in $$props) $$invalidate(7, breadcrumb = $$props.breadcrumb);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createRouteObject: q,
    		path,
    		fallback,
    		redirect,
    		firstmatch,
    		breadcrumb,
    		showContent,
    		params,
    		meta,
    		route
    	});

    	$$self.$inject_state = $$props => {
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('fallback' in $$props) $$invalidate(4, fallback = $$props.fallback);
    		if ('redirect' in $$props) $$invalidate(5, redirect = $$props.redirect);
    		if ('firstmatch' in $$props) $$invalidate(6, firstmatch = $$props.firstmatch);
    		if ('breadcrumb' in $$props) $$invalidate(7, breadcrumb = $$props.breadcrumb);
    		if ('showContent' in $$props) $$invalidate(0, showContent = $$props.showContent);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('meta' in $$props) $$invalidate(2, meta = $$props.meta);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, redirect, firstmatch, breadcrumb*/ 232) {
    			route.update({ path, redirect, firstmatch, breadcrumb });
    		}
    	};

    	return [
    		showContent,
    		params,
    		meta,
    		path,
    		fallback,
    		redirect,
    		firstmatch,
    		breadcrumb,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			path: 3,
    			fallback: 4,
    			redirect: 5,
    			firstmatch: 6,
    			breadcrumb: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fallback() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fallback(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get redirect() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set redirect(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get firstmatch() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set firstmatch(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get breadcrumb() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breadcrumb(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Component/Layout/Modal.svelte generated by Svelte v3.53.1 */
    const file$e = "src/Component/Layout/Modal.svelte";
    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    function create_fragment$g(ctx) {
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let hr0;
    	let t2;
    	let t3;
    	let hr1;
    	let t4;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const header_slot_template = /*#slots*/ ctx[4].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[3], get_header_slot_context);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			if (header_slot) header_slot.c();
    			t1 = space();
    			hr0 = element("hr");
    			t2 = space();
    			if (default_slot) default_slot.c();
    			t3 = space();
    			hr1 = element("hr");
    			t4 = space();
    			button = element("button");
    			button.textContent = "close modal";
    			attr_dev(div0, "class", "modal-background svelte-ktvnlm");
    			add_location(div0, file$e, 44, 0, 989);
    			add_location(hr0, file$e, 48, 1, 1144);
    			add_location(hr1, file$e, 50, 1, 1165);
    			button.autofocus = true;
    			attr_dev(button, "class", "svelte-ktvnlm");
    			add_location(button, file$e, 53, 1, 1211);
    			attr_dev(div1, "class", "modal svelte-ktvnlm");
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");
    			add_location(div1, file$e, 46, 0, 1044);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);

    			if (header_slot) {
    				header_slot.m(div1, null);
    			}

    			append_dev(div1, t1);
    			append_dev(div1, hr0);
    			append_dev(div1, t2);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div1, t3);
    			append_dev(div1, hr1);
    			append_dev(div1, t4);
    			append_dev(div1, button);
    			/*div1_binding*/ ctx[5](div1);
    			current = true;
    			button.focus();

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handle_keydown*/ ctx[2], false, false, false),
    					listen_dev(div0, "click", /*close*/ ctx[1], false, false, false),
    					listen_dev(button, "click", /*close*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (header_slot) {
    				if (header_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[3], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (header_slot) header_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding*/ ctx[5](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['header','default']);
    	const route = O();
    	const dispatch = createEventDispatcher();
    	const close = () => f.goto('/theater');

    	// dispatch('close');
    	let modal;

    	const handle_keydown = e => {
    		if (e.key === 'Escape') {
    			close();
    			return;
    		}

    		if (e.key === 'Tab') {
    			// trap focus
    			const nodes = modal.querySelectorAll('*');

    			const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && e.shiftKey) index = 0;
    			index += tabbable.length + (e.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			e.preventDefault();
    		}
    	};

    	const previously_focused = typeof document !== 'undefined' && document.activeElement;

    	if (previously_focused) {
    		onDestroy(() => {
    			previously_focused.focus();
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modal = $$value;
    			$$invalidate(0, modal);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		meta: O,
    		router: f,
    		route,
    		dispatch,
    		close,
    		modal,
    		handle_keydown,
    		previously_focused
    	});

    	$$self.$inject_state = $$props => {
    		if ('modal' in $$props) $$invalidate(0, modal = $$props.modal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [modal, close, handle_keydown, $$scope, slots, div1_binding];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/Component/Movie/BoxOffice.svelte generated by Svelte v3.53.1 */

    const { console: console_1$7 } = globals;
    const file$d = "src/Component/Movie/BoxOffice.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (1:0) <script>     import Modal from "../Layout/Modal.svelte";      function setSelectColor(range) {         const left = document.querySelector("#boxoffice-select-left");         const right = document.querySelector("#boxoffice-select-right");         if (range === "daily") {             left.style.backgroundColor = "#FFFFFF";             right.style.backgroundColor = "#EFEFEF";         }
    function create_catch_block_1(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block_1.name,
    		type: "catch",
    		source: "(1:0) <script>     import Modal from \\\"../Layout/Modal.svelte\\\";      function setSelectColor(range) {         const left = document.querySelector(\\\"#boxoffice-select-left\\\");         const right = document.querySelector(\\\"#boxoffice-select-right\\\");         if (range === \\\"daily\\\") {             left.style.backgroundColor = \\\"#FFFFFF\\\";             right.style.backgroundColor = \\\"#EFEFEF\\\";         }",
    		ctx
    	});

    	return block;
    }

    // (203:16) {:then ranks}
    function create_then_block$3(ctx) {
    	let div;
    	let ul;
    	let t0;
    	let a0;
    	let t1;
    	let a1;
    	let each_value = /*ranks*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			a0 = element("a");
    			t1 = space();
    			a1 = element("a");
    			attr_dev(ul, "class", "uk-slider-items uk-child-width-1-4 uk-grid");
    			add_location(ul, file$d, 204, 20, 5539);
    			attr_dev(a0, "class", "uk-position-center-left uk-position-small uk-hidden-hover");
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "uk-slidenav-previous", "");
    			attr_dev(a0, "uk-slider-item", "previous");
    			add_location(a0, file$d, 228, 20, 6984);
    			attr_dev(a1, "class", "uk-position-center-right uk-position-small uk-hidden-hover");
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "uk-slidenav-next", "");
    			attr_dev(a1, "uk-slider-item", "next");
    			add_location(a1, file$d, 229, 20, 7134);
    			attr_dev(div, "id", "boxoffice-box");
    			attr_dev(div, "uk-slider", "");
    			attr_dev(div, "class", "svelte-1b55my4");
    			add_location(div, file$d, 203, 16, 5484);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, a0);
    			append_dev(div, t1);
    			append_dev(div, a1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ranks*/ 1) {
    				each_value = /*ranks*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(203:16) {:then ranks}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     import Modal from "../Layout/Modal.svelte";      function setSelectColor(range) {         const left = document.querySelector("#boxoffice-select-left");         const right = document.querySelector("#boxoffice-select-right");         if (range === "daily") {             left.style.backgroundColor = "#FFFFFF";             right.style.backgroundColor = "#EFEFEF";         }
    function create_catch_block$3(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>     import Modal from \\\"../Layout/Modal.svelte\\\";      function setSelectColor(range) {         const left = document.querySelector(\\\"#boxoffice-select-left\\\");         const right = document.querySelector(\\\"#boxoffice-select-right\\\");         if (range === \\\"daily\\\") {             left.style.backgroundColor = \\\"#FFFFFF\\\";             right.style.backgroundColor = \\\"#EFEFEF\\\";         }",
    		ctx
    	});

    	return block;
    }

    // (208:24) {:then movie}
    function create_then_block_1(ctx) {
    	let li;
    	let div2;
    	let div0;
    	let a0;
    	let span;
    	let t0_value = /*index*/ ctx[9] + 1 + "";
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;
    	let a0_href_value;
    	let t2;
    	let div1;
    	let a1;
    	let h4;
    	let t3_value = /*movie*/ ctx[7].Data[0].Result[0].title.replace(/!HS | !HE/g, "") + "";
    	let t3;
    	let t4;
    	let h50;
    	let t5_value = /*movie*/ ctx[7].Data[0].Result[0].directors.director[0].directorNm + "";
    	let t5;
    	let t6;
    	let t7;
    	let h51;
    	let t8_value = /*movie*/ ctx[7].Data[0].Result[0].actors.actor[0].actorNm + "";
    	let t8;
    	let t9;
    	let a1_href_value;
    	let t10;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div1 = element("div");
    			a1 = element("a");
    			h4 = element("h4");
    			t3 = text(t3_value);
    			t4 = space();
    			h50 = element("h5");
    			t5 = text(t5_value);
    			t6 = text(" 감독");
    			t7 = space();
    			h51 = element("h5");
    			t8 = text(t8_value);
    			t9 = text(" 주연");
    			t10 = space();
    			attr_dev(span, "class", "svelte-1b55my4");
    			add_location(span, file$d, 212, 40, 6008);
    			if (!src_url_equal(img.src, img_src_value = /*movie*/ ctx[7].Data[0].Result[0].posters.split('|', 1)[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "포스터 불러오기 실패");
    			attr_dev(img, "class", "svelte-1b55my4");
    			add_location(img, file$d, 213, 40, 6071);
    			attr_dev(a0, "href", a0_href_value = "/movie/" + /*movie*/ ctx[7].Data[0].Result[0].movieId + "/" + /*movie*/ ctx[7].Data[0].Result[0].movieSeq);
    			add_location(a0, file$d, 211, 36, 5881);
    			add_location(div0, file$d, 210, 32, 5839);
    			attr_dev(h4, "class", "svelte-1b55my4");
    			add_location(h4, file$d, 218, 40, 6448);
    			attr_dev(h50, "class", "svelte-1b55my4");
    			add_location(h50, file$d, 219, 40, 6555);
    			attr_dev(h51, "class", "svelte-1b55my4");
    			add_location(h51, file$d, 220, 40, 6666);
    			attr_dev(a1, "href", a1_href_value = "/movie/" + /*movie*/ ctx[7].Data[0].Result[0].movieId + "/" + /*movie*/ ctx[7].Data[0].Result[0].movieSeq);
    			add_location(a1, file$d, 217, 36, 6321);
    			attr_dev(div1, "id", "movie-info");
    			attr_dev(div1, "class", "svelte-1b55my4");
    			add_location(div1, file$d, 216, 32, 6263);
    			attr_dev(div2, "class", "uk-panel");
    			add_location(div2, file$d, 209, 28, 5784);
    			add_location(li, file$d, 208, 24, 5751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			append_dev(a0, span);
    			append_dev(span, t0);
    			append_dev(a0, t1);
    			append_dev(a0, img);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, a1);
    			append_dev(a1, h4);
    			append_dev(h4, t3);
    			append_dev(a1, t4);
    			append_dev(a1, h50);
    			append_dev(h50, t5);
    			append_dev(h50, t6);
    			append_dev(a1, t7);
    			append_dev(a1, h51);
    			append_dev(h51, t8);
    			append_dev(h51, t9);
    			insert_dev(target, t10, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ranks*/ 1 && !src_url_equal(img.src, img_src_value = /*movie*/ ctx[7].Data[0].Result[0].posters.split('|', 1)[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*ranks*/ 1 && a0_href_value !== (a0_href_value = "/movie/" + /*movie*/ ctx[7].Data[0].Result[0].movieId + "/" + /*movie*/ ctx[7].Data[0].Result[0].movieSeq)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (dirty & /*ranks*/ 1 && t3_value !== (t3_value = /*movie*/ ctx[7].Data[0].Result[0].title.replace(/!HS | !HE/g, "") + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*ranks*/ 1 && t5_value !== (t5_value = /*movie*/ ctx[7].Data[0].Result[0].directors.director[0].directorNm + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*ranks*/ 1 && t8_value !== (t8_value = /*movie*/ ctx[7].Data[0].Result[0].actors.actor[0].actorNm + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*ranks*/ 1 && a1_href_value !== (a1_href_value = "/movie/" + /*movie*/ ctx[7].Data[0].Result[0].movieId + "/" + /*movie*/ ctx[7].Data[0].Result[0].movieSeq)) {
    				attr_dev(a1, "href", a1_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (detaching) detach_dev(t10);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block_1.name,
    		type: "then",
    		source: "(208:24) {:then movie}",
    		ctx
    	});

    	return block;
    }

    // (207:38)                          {:then movie}
    function create_pending_block_1(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block_1.name,
    		type: "pending",
    		source: "(207:38)                          {:then movie}",
    		ctx
    	});

    	return block;
    }

    // (206:24) {#each ranks as movie, index}
    function create_each_block$3(ctx) {
    	let await_block_anchor;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block_1,
    		then: create_then_block_1,
    		catch: create_catch_block$3,
    		value: 7
    	};

    	handle_promise(promise = /*movie*/ ctx[7], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*ranks*/ 1 && promise !== (promise = /*movie*/ ctx[7]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(206:24) {#each ranks as movie, index}",
    		ctx
    	});

    	return block;
    }

    // (202:30)                  {:then ranks}
    function create_pending_block$3(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(202:30)                  {:then ranks}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div8;
    	let div0;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let div7;
    	let div6;
    	let div4;
    	let div3;
    	let div1;
    	let h50;
    	let t5;
    	let div2;
    	let h51;
    	let t7;
    	let div5;
    	let promise;
    	let mounted;
    	let dispose;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block_1,
    		value: 0
    	};

    	handle_promise(promise = /*ranks*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "일간박스오피스";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "주간박스오피스";
    			t3 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			h50 = element("h5");
    			h50.textContent = "일간 박스오피스";
    			t5 = space();
    			div2 = element("div");
    			h51 = element("h5");
    			h51.textContent = "주간 박스오피스";
    			t7 = space();
    			div5 = element("div");
    			info.block.c();
    			add_location(button0, file$d, 185, 8, 4489);
    			add_location(button1, file$d, 186, 8, 4571);
    			add_location(div0, file$d, 184, 4, 4475);
    			attr_dev(h50, "class", "svelte-1b55my4");
    			add_location(h50, file$d, 193, 24, 5041);
    			attr_dev(div1, "id", "boxoffice-select-left");
    			attr_dev(div1, "class", "uk-padding-small svelte-1b55my4");
    			add_location(div1, file$d, 192, 20, 4885);
    			attr_dev(h51, "class", "svelte-1b55my4");
    			add_location(h51, file$d, 196, 24, 5265);
    			attr_dev(div2, "id", "boxoffice-select-right");
    			attr_dev(div2, "class", "uk-padding-small svelte-1b55my4");
    			add_location(div2, file$d, 195, 20, 5106);
    			attr_dev(div3, "id", "boxoffice-select");
    			attr_dev(div3, "class", "uk-grid-collapse uk-child-width-expand uk-text-center uk-margin-large-top svelte-1b55my4");
    			attr_dev(div3, "uk-grid", "");
    			add_location(div3, file$d, 191, 16, 4747);
    			add_location(div4, file$d, 190, 12, 4725);
    			attr_dev(div5, "id", "card-boxoffice");
    			attr_dev(div5, "class", "card-body svelte-1b55my4");
    			add_location(div5, file$d, 200, 12, 5364);
    			attr_dev(div6, "class", "uk-card uk-card-default");
    			add_location(div6, file$d, 189, 8, 4675);
    			add_location(div7, file$d, 188, 4, 4661);
    			attr_dev(div8, "class", "uk-grid-column-small uk-grid-row-small uk-child-width-1-1 uk-child-width-1-1@m");
    			attr_dev(div8, "uk-grid", "");
    			add_location(div8, file$d, 183, 0, 4370);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(div8, t3);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h50);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, h51);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			info.block.m(div5, info.anchor = null);
    			info.mount = () => div5;
    			info.anchor = null;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false),
    					listen_dev(div1, "click", /*click_handler_2*/ ctx[3], false, false, false),
    					listen_dev(div2, "click", /*click_handler_3*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*ranks*/ 1 && promise !== (promise = /*ranks*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			info.block.d();
    			info.token = null;
    			info = null;
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function setSelectColor(range) {
    	const left = document.querySelector("#boxoffice-select-left");
    	const right = document.querySelector("#boxoffice-select-right");

    	if (range === "daily") {
    		left.style.backgroundColor = "#FFFFFF";
    		right.style.backgroundColor = "#EFEFEF";
    	} else if (range === "weekly") {
    		left.style.backgroundColor = "#EFEFEF";
    		right.style.backgroundColor = "#FFFFFF";
    	}
    }

    async function getBoxOffice(range) {
    	const regex = /[^0-9]/g;
    	const response1 = await fetch("/" + range);
    	const result1 = await response1.json();
    	let list;

    	if (range === "daily") {
    		list = await result1.boxOfficeResult.dailyBoxOfficeList.map(async movie => {
    			const response = await fetch(`/searchTitle?title=${movie.movieNm}&releaseDts=${movie.openDt.replace(regex, "")}`);
    			const result = await response.json();
    			console.log(result);
    			return result;
    		});
    	} else if (range === "weekly") {
    		list = await result1.boxOfficeResult.weeklyBoxOfficeList.map(async movie => {
    			const response = await fetch(`/searchTitle?title=${movie.movieNm}&releaseDts=${movie.openDt.replace(regex, "")}`);
    			const result = await response.json();
    			console.log(result);
    			return result;
    		});
    	}

    	await console.log(list);
    	return list;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BoxOffice', slots, []);
    	let ranks = getBoxOffice("daily");

    	let sampleDatas = [
    		{
    			title: "언더 더 실버레이크",
    			audiCnt: 54344,
    			actor: ["앤드류 가필드", "앤드류 가필드"],
    			rank: 1,
    			poster: "/img/sample-silverlake.jpeg"
    		},
    		{
    			title: "헤어질 결심",
    			audiCnt: 26890,
    			actor: ["박해일", "탕웨이"],
    			rank: 2,
    			poster: "/img/sample-park.jpeg"
    		},
    		{
    			title: "미드나잇 인 파리",
    			audiCnt: 16890,
    			actor: ["오웬 윌슨", "레이첼 맥아담스"],
    			rank: 3,
    			poster: "/img/sample-paris.jpeg"
    		},
    		{
    			title: "미드소마",
    			audiCnt: 9162,
    			actor: ["플로렌스 퓨", "잭 레이너"],
    			rank: 4,
    			poster: "/img/sample-midsommar.jpg"
    		},
    		{
    			title: "스타 이즈 본",
    			audiCnt: 9162,
    			actor: ["브래들리 쿠퍼", "레이디 가가"],
    			rank: 5,
    			poster: "/img/sample-starisborn.jpg"
    		}
    	];

    	let showModal = false;
    	console.log(showModal);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<BoxOffice> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, ranks = getBoxOffice("daily"));
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, ranks = getBoxOffice("weekly"));
    	};

    	const click_handler_2 = () => {
    		$$invalidate(0, ranks = getBoxOffice("daily"));
    		setSelectColor("daily");
    	};

    	const click_handler_3 = () => {
    		$$invalidate(0, ranks = getBoxOffice("weekly"));
    		setSelectColor("weekly");
    	};

    	$$self.$capture_state = () => ({
    		Modal,
    		setSelectColor,
    		getBoxOffice,
    		ranks,
    		sampleDatas,
    		showModal
    	});

    	$$self.$inject_state = $$props => {
    		if ('ranks' in $$props) $$invalidate(0, ranks = $$props.ranks);
    		if ('sampleDatas' in $$props) sampleDatas = $$props.sampleDatas;
    		if ('showModal' in $$props) showModal = $$props.showModal;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*ranks*/ 1) {
    			{
    				console.log(ranks);
    			}
    		}
    	};

    	return [ranks, click_handler, click_handler_1, click_handler_2, click_handler_3];
    }

    class BoxOffice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BoxOffice",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/Component/Map/FindMyLocation.svelte generated by Svelte v3.53.1 */

    const { console: console_1$6 } = globals;
    const file$c = "src/Component/Map/FindMyLocation.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "현재위치 찾기";
    			add_location(button, file$c, 50, 4, 1466);
    			add_location(div, file$c, 49, 0, 1456);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
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
    			console_1$6.warn("<FindMyLocation> was created without expected prop 'map'");
    		}
    	});

    	const writable_props = ['map'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<FindMyLocation> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { map: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FindMyLocation",
    			options,
    			id: create_fragment$e.name
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

    const { console: console_1$5 } = globals;
    const file$b = "src/Component/Map/SearchLocation.svelte";

    function create_fragment$d(ctx) {
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
    			add_location(input, file$b, 10, 4, 184);
    			add_location(button, file$b, 11, 4, 254);
    			add_location(div, file$b, 9, 0, 174);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchLocation', slots, []);
    	const btnSearchLocation = document.querySelector("button#loc-search");
    	console.log(map);
    	let searchValue;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<SearchLocation> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchLocation",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/Component/Map/SetMap.svelte generated by Svelte v3.53.1 */
    const file$a = "src/Component/Map/SetMap.svelte";

    function create_fragment$c(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", "map-container");
    			attr_dev(div, "class", "svelte-12hb73n");
    			add_location(div, file$a, 30, 0, 826);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { map: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetMap",
    			options,
    			id: create_fragment$c.name
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

    const { console: console_1$4 } = globals;
    const file$9 = "src/Component/Map/SetMarker.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (201:12) {#each list as theater}
    function create_each_block$2(ctx) {
    	let div2;
    	let div0;
    	let h5;
    	let t0_value = /*theater*/ ctx[16].name + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = /*theater*/ ctx[16].address + "";
    	let t2;
    	let t3;
    	let div1;
    	let a;
    	let a_href_value;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h5 = element("h5");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			a = element("a");
    			t4 = space();
    			attr_dev(h5, "class", "svelte-14218xa");
    			add_location(h5, file$9, 203, 20, 7041);
    			attr_dev(p, "class", "svelte-14218xa");
    			add_location(p, file$9, 204, 20, 7085);
    			add_location(div0, file$9, 202, 16, 7015);
    			attr_dev(a, "href", a_href_value = "/theater/detail/" + /*theater*/ ctx[16].code);
    			attr_dev(a, "class", "uk-icon-link");
    			attr_dev(a, "uk-icon", "info");
    			add_location(a, file$9, 207, 20, 7175);
    			add_location(div1, file$9, 206, 16, 7149);
    			attr_dev(div2, "class", "theater-info-mini svelte-14218xa");
    			add_location(div2, file$9, 201, 12, 6903);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h5);
    			append_dev(h5, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(p, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, a);
    			append_dev(div2, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "mouseenter", handleMouseEnter, false, false, false),
    					listen_dev(div2, "mouseleave", handleMouseOut, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*list*/ 1 && t0_value !== (t0_value = /*theater*/ ctx[16].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*list*/ 1 && t2_value !== (t2_value = /*theater*/ ctx[16].address + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*list*/ 1 && a_href_value !== (a_href_value = "/theater/detail/" + /*theater*/ ctx[16].code)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(201:12) {#each list as theater}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let each_value = /*list*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "id", "list-theater");
    			attr_dev(div0, "class", "svelte-14218xa");
    			add_location(div0, file$9, 190, 8, 6421);
    			add_location(div1, file$9, 189, 4, 6407);
    			attr_dev(div2, "id", "theaterInfo");
    			attr_dev(div2, "class", "svelte-14218xa");
    			add_location(div2, file$9, 188, 0, 6380);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*handleMouseEnter, handleMouseOut, list*/ 1) {
    				each_value = /*list*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
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
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
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

    function getDistance(theater, latMid, lngMid) {
    	const lat = theater.marker.getPosition().getLat();
    	const lng = theater.marker.getPosition().getLng();
    	return (latMid - lat) ** 2 + (lngMid - lng) ** 2;
    }

    function handleMouseEnter(event) {
    	event.target.style.backgroundColor = "#eeeeee";
    }

    function handleMouseOut(event) {
    	event.target.style.backgroundColor = "white";
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let list;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SetMarker', slots, []);
    	let { map } = $$props;
    	let { selectedTheater } = $$props;
    	const theaters = [];
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
    				f.goto('/theater/detail/' + theater.code);
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
    			const latAvg = (latMin + latMax) / 2;
    			const lngAvg = (lngMin + lngMax) / 2;
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

    			$$invalidate(0, list = listTheater.sort((a, b) => {
    				return getDistance(a, latAvg, lngAvg) - getDistance(b, latAvg, lngAvg);
    			}));
    		}

    		setMarkerList();
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
    			console_1$4.warn("<SetMarker> was created without expected prop 'map'");
    		}

    		if (selectedTheater === undefined && !('selectedTheater' in $$props || $$self.$$.bound[$$self.$$.props['selectedTheater']])) {
    			console_1$4.warn("<SetMarker> was created without expected prop 'selectedTheater'");
    		}
    	});

    	const writable_props = ['map', 'selectedTheater'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<SetMarker> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('map' in $$props) $$invalidate(1, map = $$props.map);
    		if ('selectedTheater' in $$props) $$invalidate(2, selectedTheater = $$props.selectedTheater);
    	};

    	$$self.$capture_state = () => ({
    		router: f,
    		map,
    		selectedTheater,
    		theaters,
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
    		getDistance,
    		setCoords,
    		handleMouseEnter,
    		handleMouseOut,
    		list
    	});

    	$$self.$inject_state = $$props => {
    		if ('map' in $$props) $$invalidate(1, map = $$props.map);
    		if ('selectedTheater' in $$props) $$invalidate(2, selectedTheater = $$props.selectedTheater);
    		if ('geocoder' in $$props) geocoder = $$props.geocoder;
    		if ('markerSize' in $$props) markerSize = $$props.markerSize;
    		if ('markerOption' in $$props) markerOption = $$props.markerOption;
    		if ('cgvMarker' in $$props) cgvMarker = $$props.cgvMarker;
    		if ('cgv4dxMarker' in $$props) cgv4dxMarker = $$props.cgv4dxMarker;
    		if ('cgvImaxMarker' in $$props) cgvImaxMarker = $$props.cgvImaxMarker;
    		if ('lotteMarker' in $$props) lotteMarker = $$props.lotteMarker;
    		if ('megaboxMarker' in $$props) megaboxMarker = $$props.megaboxMarker;
    		if ('otherMarker' in $$props) otherMarker = $$props.otherMarker;
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(0, list = []);
    	return [list, map, selectedTheater];
    }

    class SetMarker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { map: 1, selectedTheater: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetMarker",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get map() {
    		throw new Error("<SetMarker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set map(value) {
    		throw new Error("<SetMarker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedTheater() {
    		throw new Error("<SetMarker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedTheater(value) {
    		throw new Error("<SetMarker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Component/Map/TheaterPopup.svelte generated by Svelte v3.53.1 */

    const { console: console_1$3 } = globals;
    const file$8 = "src/Component/Map/TheaterPopup.svelte";

    // (49:4) {:catch}
    function create_catch_block$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "올바르지 않은 주소입니다.";
    			add_location(p, file$8, 49, 8, 1141);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(49:4) {:catch}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {:then modalTheater}
    function create_then_block$2(ctx) {
    	let t0_value = /*modalTheater*/ ctx[1].name + "";
    	let t0;
    	let t1;
    	let h40;
    	let t2_value = /*modalTheater*/ ctx[1].address + "";
    	let t2;
    	let t3;
    	let h41;
    	let t4_value = /*modalTheater*/ ctx[1].company + "";
    	let t4;
    	let t5;
    	let ol;
    	let li;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			h40 = element("h4");
    			t2 = text(t2_value);
    			t3 = space();
    			h41 = element("h4");
    			t4 = text(t4_value);
    			t5 = space();
    			ol = element("ol");
    			li = element("li");
    			li.textContent = "of or relating to modality in logic";
    			add_location(h40, file$8, 42, 4, 955);
    			add_location(h41, file$8, 43, 4, 991);
    			add_location(li, file$8, 46, 8, 1065);
    			attr_dev(ol, "class", "definition-list");
    			add_location(ol, file$8, 45, 4, 1028);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h40, anchor);
    			append_dev(h40, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h41, anchor);
    			append_dev(h41, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, ol, anchor);
    			append_dev(ol, li);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h40);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h41);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(ol);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(38:4) {:then modalTheater}",
    		ctx
    	});

    	return block;
    }

    // (37:25)      {:then modalTheater}
    function create_pending_block$2(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(37:25)      {:then modalTheater}",
    		ctx
    	});

    	return block;
    }

    // (34:0) <Modal on:close="{() => showModal = false}">
    function create_default_slot$2(ctx) {
    	let await_block_anchor;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 1
    	};

    	handle_promise(/*modalTheater*/ ctx[1], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(34:0) <Modal on:close=\\\"{() => showModal = false}\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:4) 
    function create_header_slot(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			attr_dev(h2, "slot", "header");
    			add_location(h2, file$8, 34, 4, 835);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_header_slot.name,
    		type: "slot",
    		source: "(35:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: {
    					header: [create_header_slot],
    					default: [create_default_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("close", /*close_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
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

    async function findTheater(code) {
    	const response = await fetch("/theatercode?code=" + code);
    	const result = await response.json();
    	console.log(response);
    	console.log(result);
    	return result;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TheaterPopup', slots, []);
    	let showModal = false;
    	let route = O();
    	console.log(route.params._code);
    	let code = route.params._code;
    	console.log(code);
    	let modalTheater = findTheater(route.params._code);
    	console.log(modalTheater);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<TheaterPopup> was created with unknown prop '${key}'`);
    	});

    	const close_handler = () => $$invalidate(0, showModal = false);

    	$$self.$capture_state = () => ({
    		showModal,
    		Modal,
    		meta: O,
    		onMount,
    		route,
    		code,
    		findTheater,
    		modalTheater
    	});

    	$$self.$inject_state = $$props => {
    		if ('showModal' in $$props) $$invalidate(0, showModal = $$props.showModal);
    		if ('route' in $$props) route = $$props.route;
    		if ('code' in $$props) code = $$props.code;
    		if ('modalTheater' in $$props) $$invalidate(1, modalTheater = $$props.modalTheater);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	{
    		console.log(modalTheater);
    	}

    	return [showModal, modalTheater, close_handler];
    }

    class TheaterPopup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TheaterPopup",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/Component/Map/Map.svelte generated by Svelte v3.53.1 */
    const file$7 = "src/Component/Map/Map.svelte";

    // (42:4) <Route path='/detail/:_code'>
    function create_default_slot$1(ctx) {
    	let theaterpopup;
    	let updating_selectedTheater;
    	let current;

    	function theaterpopup_selectedTheater_binding(value) {
    		/*theaterpopup_selectedTheater_binding*/ ctx[5](value);
    	}

    	let theaterpopup_props = {};

    	if (/*selectedTheater*/ ctx[1] !== void 0) {
    		theaterpopup_props.selectedTheater = /*selectedTheater*/ ctx[1];
    	}

    	theaterpopup = new TheaterPopup({
    			props: theaterpopup_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(theaterpopup, 'selectedTheater', theaterpopup_selectedTheater_binding));

    	const block = {
    		c: function create() {
    			create_component(theaterpopup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(theaterpopup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const theaterpopup_changes = {};

    			if (!updating_selectedTheater && dirty & /*selectedTheater*/ 2) {
    				updating_selectedTheater = true;
    				theaterpopup_changes.selectedTheater = /*selectedTheater*/ ctx[1];
    				add_flush_callback(() => updating_selectedTheater = false);
    			}

    			theaterpopup.$set(theaterpopup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(theaterpopup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(theaterpopup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(theaterpopup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(42:4) <Route path='/detail/:_code'>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let setmap;
    	let updating_map;
    	let t0;
    	let setmarker;
    	let updating_map_1;
    	let updating_selectedTheater;
    	let t1;
    	let route;
    	let current;

    	function setmap_map_binding(value) {
    		/*setmap_map_binding*/ ctx[2](value);
    	}

    	let setmap_props = {};

    	if (/*map*/ ctx[0] !== void 0) {
    		setmap_props.map = /*map*/ ctx[0];
    	}

    	setmap = new SetMap({ props: setmap_props, $$inline: true });
    	binding_callbacks.push(() => bind(setmap, 'map', setmap_map_binding));

    	function setmarker_map_binding(value) {
    		/*setmarker_map_binding*/ ctx[3](value);
    	}

    	function setmarker_selectedTheater_binding(value) {
    		/*setmarker_selectedTheater_binding*/ ctx[4](value);
    	}

    	let setmarker_props = {};

    	if (/*map*/ ctx[0] !== void 0) {
    		setmarker_props.map = /*map*/ ctx[0];
    	}

    	if (/*selectedTheater*/ ctx[1] !== void 0) {
    		setmarker_props.selectedTheater = /*selectedTheater*/ ctx[1];
    	}

    	setmarker = new SetMarker({ props: setmarker_props, $$inline: true });
    	binding_callbacks.push(() => bind(setmarker, 'map', setmarker_map_binding));
    	binding_callbacks.push(() => bind(setmarker, 'selectedTheater', setmarker_selectedTheater_binding));

    	route = new Route({
    			props: {
    				path: "/detail/:_code",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(setmap.$$.fragment);
    			t0 = space();
    			create_component(setmarker.$$.fragment);
    			t1 = space();
    			create_component(route.$$.fragment);
    			attr_dev(div0, "id", "map");
    			attr_dev(div0, "class", "svelte-mxkq0e");
    			add_location(div0, file$7, 35, 4, 837);
    			add_location(div1, file$7, 27, 0, 523);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(setmap, div0, null);
    			append_dev(div0, t0);
    			mount_component(setmarker, div0, null);
    			append_dev(div1, t1);
    			mount_component(route, div1, null);
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

    			if (!updating_selectedTheater && dirty & /*selectedTheater*/ 2) {
    				updating_selectedTheater = true;
    				setmarker_changes.selectedTheater = /*selectedTheater*/ ctx[1];
    				add_flush_callback(() => updating_selectedTheater = false);
    			}

    			setmarker.$set(setmarker_changes);
    			const route_changes = {};

    			if (dirty & /*$$scope, selectedTheater*/ 66) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setmap.$$.fragment, local);
    			transition_in(setmarker.$$.fragment, local);
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setmap.$$.fragment, local);
    			transition_out(setmarker.$$.fragment, local);
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(setmap);
    			destroy_component(setmarker);
    			destroy_component(route);
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
    	validate_slots('Map', slots, []);
    	let map;
    	let selectedTheater = {};
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

    	function setmarker_selectedTheater_binding(value) {
    		selectedTheater = value;
    		$$invalidate(1, selectedTheater);
    	}

    	function theaterpopup_selectedTheater_binding(value) {
    		selectedTheater = value;
    		$$invalidate(1, selectedTheater);
    	}

    	$$self.$capture_state = () => ({
    		Route,
    		FindMyLocation,
    		SearchLocation,
    		SetMap,
    		SetMarker,
    		TheaterPopup,
    		map,
    		selectedTheater
    	});

    	$$self.$inject_state = $$props => {
    		if ('map' in $$props) $$invalidate(0, map = $$props.map);
    		if ('selectedTheater' in $$props) $$invalidate(1, selectedTheater = $$props.selectedTheater);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		map,
    		selectedTheater,
    		setmap_map_binding,
    		setmarker_map_binding,
    		setmarker_selectedTheater_binding,
    		theaterpopup_selectedTheater_binding
    	];
    }

    class Map$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Map",
    			options,
    			id: create_fragment$9.name
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
    const file$6 = "src/Component/MovieCard/MovieCard.svelte";

    function create_fragment$8(ctx) {
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
    			add_location(img, file$6, 39, 8, 1507);
    			add_location(div0, file$6, 38, 4, 1493);
    			attr_dev(h5, "class", "movie-title");
    			add_location(h5, file$6, 43, 12, 1681);
    			attr_dev(dd0, "class", "movie-year");
    			add_location(dd0, file$6, 44, 12, 1735);
    			attr_dev(dd1, "class", "movie-comment");
    			add_location(dd1, file$6, 45, 12, 1791);
    			attr_dev(dl, "class", "uk-description-list");
    			add_location(dl, file$6, 42, 8, 1636);
    			attr_dev(div1, "class", "uk-card-body");
    			add_location(div1, file$6, 41, 4, 1601);
    			attr_dev(div2, "class", "uk-card uk-card-default movie-card");
    			add_location(div2, file$6, 37, 0, 1432);
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
    		id: create_fragment$8.name,
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

    function instance$8($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MovieCard",
    			options,
    			id: create_fragment$8.name
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
    const file$5 = "src/Component/MovieCard/MovieCards.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (40:4) {#each datas as data}
    function create_each_block$1(ctx) {
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
    			add_location(div, file$5, 40, 8, 1095);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(40:4) {#each datas as data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let current;
    	let each_value = /*datas*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
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
    			add_location(div, file$5, 38, 0, 890);
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
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MovieCards",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Component/Nav/SideNav.svelte generated by Svelte v3.53.1 */

    const file$4 = "src/Component/Nav/SideNav.svelte";

    function create_fragment$6(ctx) {
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
    			add_location(div0, file$4, 2, 8, 160);
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$4, 6, 34, 308);
    			attr_dev(li0, "class", "uk-active");
    			add_location(li0, file$4, 6, 12, 286);
    			attr_dev(span0, "uk-nav-parent-icon", "");
    			add_location(span0, file$4, 8, 31, 398);
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$4, 8, 16, 383);
    			attr_dev(a2, "href", "#");
    			add_location(a2, file$4, 10, 24, 499);
    			add_location(li1, file$4, 10, 20, 495);
    			attr_dev(a3, "href", "#");
    			add_location(a3, file$4, 11, 24, 554);
    			add_location(li2, file$4, 11, 20, 550);
    			attr_dev(ul0, "class", "uk-nav-sub");
    			add_location(ul0, file$4, 9, 16, 451);
    			attr_dev(li3, "class", "uk-parent");
    			add_location(li3, file$4, 7, 12, 344);
    			attr_dev(li4, "class", "uk-nav-divider");
    			add_location(li4, file$4, 14, 12, 637);
    			attr_dev(li5, "class", "uk-nav-header");
    			add_location(li5, file$4, 15, 12, 682);
    			attr_dev(span1, "class", "uk-margin-small-right");
    			attr_dev(span1, "uk-icon", "icon: table");
    			add_location(span1, file$4, 16, 28, 748);
    			attr_dev(a4, "href", "#");
    			add_location(a4, file$4, 16, 16, 736);
    			add_location(li6, file$4, 16, 12, 732);
    			attr_dev(span2, "class", "uk-margin-small-right");
    			attr_dev(span2, "uk-icon", "icon: thumbnails");
    			add_location(span2, file$4, 17, 28, 857);
    			attr_dev(a5, "href", "#");
    			add_location(a5, file$4, 17, 16, 845);
    			add_location(li7, file$4, 17, 12, 841);
    			attr_dev(span3, "class", "uk-margin-small-right");
    			attr_dev(span3, "uk-icon", "icon: thumbnails");
    			add_location(span3, file$4, 18, 28, 965);
    			attr_dev(a6, "href", "#");
    			add_location(a6, file$4, 18, 16, 953);
    			add_location(li8, file$4, 18, 12, 949);
    			attr_dev(span4, "class", "uk-margin-small-right");
    			attr_dev(span4, "uk-icon", "icon: trash");
    			add_location(span4, file$4, 19, 28, 1082);
    			attr_dev(a7, "href", "#");
    			add_location(a7, file$4, 19, 16, 1070);
    			add_location(li9, file$4, 19, 12, 1066);
    			attr_dev(ul1, "class", "uk-nav-default uk-padding-small");
    			attr_dev(ul1, "uk-nav", "");
    			add_location(ul1, file$4, 5, 8, 222);
    			attr_dev(div1, "class", "uk-width-1-1 uk-card uk-card-default");
    			attr_dev(div1, "uk-sticky", "offset: 20; media: @m");
    			add_location(div1, file$4, 1, 4, 67);
    			attr_dev(div2, "class", "uk-width-medium@m uk-width-1-1 uk-padding-small");
    			add_location(div2, file$4, 0, 0, 0);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNav",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Component/Movie/MovieInfo.svelte generated by Svelte v3.53.1 */

    const { console: console_1$2 } = globals;
    const file$3 = "src/Component/Movie/MovieInfo.svelte";

    // (1:0) <script>     import { meta }
    function create_catch_block$1(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>     import { meta }",
    		ctx
    	});

    	return block;
    }

    // (26:12) {:then movie}
    function create_then_block$1(ctx) {
    	let h4;
    	let t_value = /*movie*/ ctx[0].Data[0].Result[0].title.replace(/!HS | !HE/g, "") + "";
    	let t;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(t_value);
    			add_location(h4, file$3, 26, 16, 667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(26:12) {:then movie}",
    		ctx
    	});

    	return block;
    }

    // (24:26)                               {:then movie}
    function create_pending_block$1(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(24:26)                               {:then movie}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div2;
    	let div1;
    	let div0;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 0
    	};

    	handle_promise(/*movie*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			info.block.c();
    			attr_dev(div0, "class", "uk-card uk-card-default");
    			add_location(div0, file$3, 22, 8, 542);
    			add_location(div1, file$3, 21, 4, 528);
    			attr_dev(div2, "class", "uk-grid-column-small uk-grid-row-small uk-child-width-1-1 uk-child-width-1-1@m");
    			attr_dev(div2, "uk-grid", "");
    			add_location(div2, file$3, 20, 0, 423);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			info.block.m(div0, info.anchor = null);
    			info.mount = () => div0;
    			info.anchor = null;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			info.block.d();
    			info.token = null;
    			info = null;
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

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MovieInfo', slots, []);
    	const route = O();
    	const movieId = route.params.movieId;
    	const movieSeq = route.params.movieSeq;

    	async function getMovie() {
    		const response = await fetch(`/searchCode?movieId=${movieId}&movieSeq=${movieSeq}`);
    		const result = await response.json();
    		return result;
    	}

    	let movie = getMovie();
    	console.log(movie);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<MovieInfo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		meta: O,
    		route,
    		movieId,
    		movieSeq,
    		getMovie,
    		movie
    	});

    	$$self.$inject_state = $$props => {
    		if ('movie' in $$props) $$invalidate(0, movie = $$props.movie);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [movie];
    }

    class MovieInfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MovieInfo",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Component/Movie/MovieSearch.svelte generated by Svelte v3.53.1 */

    const { console: console_1$1 } = globals;
    const file$2 = "src/Component/Movie/MovieSearch.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>     import { meta }
    function create_catch_block(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>     import { meta }",
    		ctx
    	});

    	return block;
    }

    // (25:12) {:then movieList}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*movieList*/ ctx[0].Data[0].Result;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*movieList*/ 1) {
    				each_value = /*movieList*/ ctx[0].Data[0].Result;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(25:12) {:then movieList}",
    		ctx
    	});

    	return block;
    }

    // (26:12) {#each movieList.Data[0].Result as data}
    function create_each_block(ctx) {
    	let div;
    	let t0_value = /*data*/ ctx[4].title.replace(/!HS | !HE/g, "") + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(div, file$2, 26, 16, 692);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*movieList*/ 1 && t0_value !== (t0_value = /*data*/ ctx[4].title.replace(/!HS | !HE/g, "") + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(26:12) {#each movieList.Data[0].Result as data}",
    		ctx
    	});

    	return block;
    }

    // (24:30)              {:then movieList}
    function create_pending_block(ctx) {
    	const block = { c: noop, m: noop, p: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(24:30)              {:then movieList}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let promise;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 0
    	};

    	handle_promise(promise = /*movieList*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			info.block.c();
    			attr_dev(div0, "class", "uk-card uk-card-default");
    			add_location(div0, file$2, 22, 8, 523);
    			add_location(div1, file$2, 21, 4, 509);
    			attr_dev(div2, "class", "uk-grid-column-small uk-grid-row-small uk-child-width-1-1 uk-child-width-1-1@m");
    			attr_dev(div2, "uk-grid", "");
    			add_location(div2, file$2, 20, 0, 404);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			info.block.m(div0, info.anchor = null);
    			info.mount = () => div0;
    			info.anchor = null;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*movieList*/ 1 && promise !== (promise = /*movieList*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			info.block.d();
    			info.token = null;
    			info = null;
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
    	let movieTitle;
    	let movieList;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MovieSearch', slots, []);
    	const route = O();

    	async function getMovie() {
    		const response = await fetch(`/searchTitle?releaseDts=19000101&title=${movieTitle}`);
    		const result = await response.json();
    		return result;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<MovieSearch> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		meta: O,
    		route,
    		getMovie,
    		movieList,
    		movieTitle
    	});

    	$$self.$inject_state = $$props => {
    		if ('movieList' in $$props) $$invalidate(0, movieList = $$props.movieList);
    		if ('movieTitle' in $$props) movieTitle = $$props.movieTitle;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*movieList*/ 1) {
    			{
    				console.log(movieList);
    			}
    		}
    	};

    	movieTitle = route.params.title;
    	$$invalidate(0, movieList = getMovie());
    	return [movieList];
    }

    class MovieSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MovieSearch",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Component/Movie/Loading.svelte generated by Svelte v3.53.1 */

    const { console: console_1 } = globals;

    function create_fragment$3(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	const route = O();
    	let movieTitle = route.params.title;
    	console.log(movieTitle);
    	console.log("loading..");
    	f.goto(`/search/${movieTitle}`);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ meta: O, router: f, route, movieTitle });

    	$$self.$inject_state = $$props => {
    		if ('movieTitle' in $$props) movieTitle = $$props.movieTitle;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Component/Layout/Content.svelte generated by Svelte v3.53.1 */
    const file$1 = "src/Component/Layout/Content.svelte";

    // (15:4) <Route path="/">
    function create_default_slot_4(ctx) {
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
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(15:4) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:4) <Route path="/theater/*">
    function create_default_slot_3(ctx) {
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
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(19:4) <Route path=\\\"/theater/*\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:4) <Route path="/movie/:movieId/:movieSeq">
    function create_default_slot_2(ctx) {
    	let movieinfo;
    	let current;
    	movieinfo = new MovieInfo({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(movieinfo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(movieinfo, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(movieinfo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(movieinfo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(movieinfo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(22:4) <Route path=\\\"/movie/:movieId/:movieSeq\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:4) <Route path="/search/:title">
    function create_default_slot_1(ctx) {
    	let moviesearch;
    	let current;
    	moviesearch = new MovieSearch({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(moviesearch.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(moviesearch, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(moviesearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(moviesearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(moviesearch, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(25:4) <Route path=\\\"/search/:title\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:4) <Route path="/loading/:title">
    function create_default_slot(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:4) <Route path=\\\"/loading/:title\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/theater/*",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/movie/:movieId/:movieSeq",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "/search/:title",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "/loading/:title",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    			set_style(div, "margin", "0 auto");
    			attr_dev(div, "class", "uk-width-1-1 uk-width-5-6@s uk-padding-small");
    			add_location(div, file$1, 13, 0, 470);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			append_dev(div, t2);
    			mount_component(route3, div, null);
    			append_dev(div, t3);
    			mount_component(route4, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
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

    	$$self.$capture_state = () => ({
    		BoxOffice,
    		Map: Map$1,
    		MovieCards,
    		SideNav,
    		MovieInfo,
    		MovieSearch,
    		Loading,
    		Route,
    		viewMode
    	});

    	$$self.$inject_state = $$props => {
    		if ('viewMode' in $$props) viewMode = $$props.viewMode;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
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
    	let div5;
    	let div1;
    	let img;
    	let img_src_value;
    	let t1;
    	let div0;
    	let h2;
    	let t3;
    	let h3;
    	let t5;
    	let div3;
    	let div2;
    	let input;
    	let t6;
    	let button;
    	let t8;
    	let span;
    	let t9;
    	let div4;
    	let h40;
    	let a0;
    	let t11;
    	let h41;
    	let a1;
    	let t13;
    	let h42;
    	let t15;
    	let h43;
    	let t17;
    	let div6;
    	let content;
    	let current;
    	let mounted;
    	let dispose;
    	content = new Content({ $$inline: true });

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			script0 = element("script");
    			script1 = element("script");
    			t0 = space();
    			div5 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t1 = space();
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "WWM";
    			t3 = space();
    			h3 = element("h3");
    			h3.textContent = "World Wide Movie";
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			input = element("input");
    			t6 = space();
    			button = element("button");
    			button.textContent = "출발";
    			t8 = space();
    			span = element("span");
    			t9 = space();
    			div4 = element("div");
    			h40 = element("h4");
    			a0 = element("a");
    			a0.textContent = "영화 탐색";
    			t11 = space();
    			h41 = element("h4");
    			a1 = element("a");
    			a1.textContent = "영화관 찾기";
    			t13 = space();
    			h42 = element("h4");
    			h42.textContent = "Login";
    			t15 = space();
    			h43 = element("h4");
    			h43.textContent = "Register";
    			t17 = space();
    			div6 = element("div");
    			create_component(content.$$.fragment);
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "href", "https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/css/uikit.min.css");
    			add_location(link0, file, 7, 4, 138);
    			attr_dev(link1, "href", "https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css");
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "type", "text/css");
    			add_location(link1, file, 8, 4, 241);
    			if (!src_url_equal(script0.src, script0_src_value = "https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit.min.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file, 10, 4, 361);
    			if (!src_url_equal(script1.src, script1_src_value = "https://cdn.jsdelivr.net/npm/uikit@3.15.10/dist/js/uikit-icons.min.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file, 11, 4, 453);
    			if (!src_url_equal(img.src, img_src_value = "/img/wwm_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-5u4rpj");
    			add_location(img, file, 98, 8, 2038);
    			attr_dev(h2, "class", "svelte-5u4rpj");
    			add_location(h2, file, 100, 12, 2095);
    			attr_dev(h3, "class", "svelte-5u4rpj");
    			add_location(h3, file, 101, 12, 2120);
    			attr_dev(div0, "class", "svelte-5u4rpj");
    			add_location(div0, file, 99, 8, 2077);
    			attr_dev(div1, "id", "header-logo");
    			attr_dev(div1, "class", "svelte-5u4rpj");
    			add_location(div1, file, 97, 4, 2007);
    			attr_dev(input, "id", "search-input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "영화 제목 검색");
    			attr_dev(input, "class", "svelte-5u4rpj");
    			add_location(input, file, 107, 12, 2236);
    			add_location(button, file, 108, 12, 2334);
    			attr_dev(span, "uk-icon", "search");
    			attr_dev(span, "class", "svelte-5u4rpj");
    			add_location(span, file, 109, 12, 2423);
    			attr_dev(div2, "class", "svelte-5u4rpj");
    			add_location(div2, file, 106, 8, 2218);
    			attr_dev(div3, "id", "header-search");
    			attr_dev(div3, "class", "svelte-5u4rpj");
    			add_location(div3, file, 105, 4, 2185);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "svelte-5u4rpj");
    			add_location(a0, file, 113, 12, 2575);
    			attr_dev(h40, "class", "svelte-5u4rpj");
    			add_location(h40, file, 113, 8, 2571);
    			attr_dev(a1, "href", "/theater");
    			attr_dev(a1, "class", "svelte-5u4rpj");
    			add_location(a1, file, 114, 12, 2614);
    			attr_dev(h41, "class", "svelte-5u4rpj");
    			add_location(h41, file, 114, 8, 2610);
    			attr_dev(h42, "class", "svelte-5u4rpj");
    			add_location(h42, file, 115, 8, 2657);
    			attr_dev(h43, "class", "svelte-5u4rpj");
    			add_location(h43, file, 116, 8, 2680);
    			attr_dev(div4, "id", "header-menu");
    			attr_dev(div4, "class", "svelte-5u4rpj");
    			add_location(div4, file, 112, 4, 2540);
    			attr_dev(div5, "id", "header");
    			attr_dev(div5, "class", "svelte-5u4rpj");
    			add_location(div5, file, 96, 0, 1985);
    			attr_dev(div6, "uk-grid", "");
    			attr_dev(div6, "class", "uk-grid-collapse");
    			add_location(div6, file, 119, 0, 2716);
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
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, img);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t3);
    			append_dev(div0, h3);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			append_dev(div3, div2);
    			append_dev(div2, input);
    			set_input_value(input, /*movieTitle*/ ctx[0]);
    			append_dev(div2, t6);
    			append_dev(div2, button);
    			append_dev(div2, t8);
    			append_dev(div2, span);
    			append_dev(div5, t9);
    			append_dev(div5, div4);
    			append_dev(div4, h40);
    			append_dev(h40, a0);
    			append_dev(div4, t11);
    			append_dev(div4, h41);
    			append_dev(h41, a1);
    			append_dev(div4, t13);
    			append_dev(div4, h42);
    			append_dev(div4, t15);
    			append_dev(div4, h43);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, div6, anchor);
    			mount_component(content, div6, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[1]),
    					listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(span, "click", /*click_handler_1*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*movieTitle*/ 1 && input.value !== /*movieTitle*/ ctx[0]) {
    				set_input_value(input, /*movieTitle*/ ctx[0]);
    			}
    		},
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
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(div6);
    			destroy_component(content);
    			mounted = false;
    			run_all(dispose);
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
    	let movieTitle;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		movieTitle = this.value;
    		$$invalidate(0, movieTitle);
    	}

    	const click_handler = () => {
    		f.goto(`/loading/${movieTitle}`);
    	};

    	const click_handler_1 = () => {
    		f.goto(`/search/${movieTitle}`);
    	};

    	$$self.$capture_state = () => ({ Content, router: f, movieTitle });

    	$$self.$inject_state = $$props => {
    		if ('movieTitle' in $$props) $$invalidate(0, movieTitle = $$props.movieTitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [movieTitle, input_input_handler, click_handler, click_handler_1];
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
