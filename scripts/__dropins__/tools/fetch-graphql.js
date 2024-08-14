export const id=85;export const ids=[85];export const modules={597:(e,t,r)=>{function n(e,t,r,n,a,i,s){try{var h=e[i](s),o=h.value}catch(e){return void r(e)}h.done?t(o):Promise.resolve(o).then(n,a)}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){s(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t,r){var n;return(t="symbol"==typeof(n=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?n:String(n))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}r.d(t,{AZ:()=>v,Cz:()=>l,MR:()=>d,Np:()=>f,WI:()=>c,Xx:()=>u,zj:()=>b});var h={"Content-Type":"application/json",Accept:"application/json"};class o{get endpoint(){return this._endpoint}get fetchGraphQlHeaders(){return this._fetchGraphQlHeaders}setEndpoint(e){this._endpoint=e}setFetchGraphQlHeader(e,t){this._fetchGraphQlHeaders=i(i({},this.fetchGraphQlHeaders),{},{[e]:t})}removeFetchGraphQlHeader(e){var t;null===(t=this._fetchGraphQlHeaders)||void 0===t||delete t[e]}setFetchGraphQlHeaders(e){this._fetchGraphQlHeaders=i({},e)}fetchGraphQl(e,t){var r,a=this;return(r=function*(){var r=a.endpoint,n=a.fetchGraphQlHeaders;if(!r)throw Error('Missing "url"');var s,o=(null==t?void 0:t.method)||"POST",p=null==t?void 0:t.cache,c=null==t?void 0:t.signal,l=new URL(r),d=i(i({},h),n);return"POST"===o&&(s=JSON.stringify({query:e,variables:null==t?void 0:t.variables})),"GET"===o&&(l.searchParams.append("query",e.trim()),null!=t&&t.variables&&l.searchParams.append("variables",JSON.stringify(t.variables))),yield fetch(l,{method:o,headers:d,body:s,cache:p,signal:c}).then((e=>e.json()))},function(){var e=this,t=arguments;return new Promise((function(a,i){var s=r.apply(e,t);function h(e){n(s,a,i,h,o,"next",e)}function o(e){n(s,a,i,h,o,"throw",e)}h(void 0)}))})()}getConfig(){return{endpoint:this.endpoint,fetchGraphQlHeaders:this.fetchGraphQlHeaders}}getMethods(){return{setEndpoint:this.setEndpoint.bind(this),setFetchGraphQlHeader:this.setFetchGraphQlHeader.bind(this),removeFetchGraphQlHeader:this.removeFetchGraphQlHeader.bind(this),setFetchGraphQlHeaders:this.setFetchGraphQlHeaders.bind(this),fetchGraphQl:this.fetchGraphQl.bind(this),getConfig:this.getConfig.bind(this)}}}var p=new o;class c extends o{get endpoint(){var e;return null!==(e=this._endpoint)&&void 0!==e?e:p.endpoint}get fetchGraphQlHeaders(){return(this._endpoint?this._fetchGraphQlHeaders:i(i({},this._fetchGraphQlHeaders),p.fetchGraphQlHeaders))||{}}}var{setEndpoint:l,setFetchGraphQlHeaders:d,setFetchGraphQlHeader:f,removeFetchGraphQlHeader:u,fetchGraphQl:v,getConfig:b}=p.getMethods()}};import e from"./runtime.js";import*as t from"./fetch-graphql.js";e.C(t);var r,n=(r=597,e(e.s=r)),a=n.WI,i=n.AZ,s=n.zj,h=n.Xx,o=n.Cz,p=n.Np,c=n.MR;export{a as FetchGraphQL,i as fetchGraphQl,s as getConfig,h as removeFetchGraphQlHeader,o as setEndpoint,p as setFetchGraphQlHeader,c as setFetchGraphQlHeaders};