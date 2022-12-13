import { writable, get } from "svelte/store";
import { getApi, putApi, delApi, postApi } from './service/api';
import { router } from 'tinro';

function setArticles() {
    let initValues = {
        articleList
    }
}