import './style/index.less';
import {App} from './ui/app';

/**
 * get DOM element from DOM tree using id
 */
const element = document.getElementById('app');

/**
 * initialize react app by calling it's static method init
 */
App.init(element);
