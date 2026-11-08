import{F as on,q as N,t as ve,u as an,m as un,e as fr,v as ln,L as cn,j as hn,w as Te,S as dn,h as fn,C as pn,r as We}from"./index.esm2017-ZCVdDML3.js";var He=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var pr;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(d,o){function l(){}l.prototype=o.prototype,d.D=o.prototype,d.prototype=new l,d.prototype.constructor=d,d.C=function(c,h,f){for(var u=Array(arguments.length-2),it=2;it<arguments.length;it++)u[it-2]=arguments[it];return o.prototype[h].apply(c,u)}}function e(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}t(n,e),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(d,o,l){l||(l=0);var c=Array(16);if(typeof o=="string")for(var h=0;16>h;++h)c[h]=o.charCodeAt(l++)|o.charCodeAt(l++)<<8|o.charCodeAt(l++)<<16|o.charCodeAt(l++)<<24;else for(h=0;16>h;++h)c[h]=o[l++]|o[l++]<<8|o[l++]<<16|o[l++]<<24;o=d.g[0],l=d.g[1],h=d.g[2];var f=d.g[3],u=o+(f^l&(h^f))+c[0]+3614090360&4294967295;o=l+(u<<7&4294967295|u>>>25),u=f+(h^o&(l^h))+c[1]+3905402710&4294967295,f=o+(u<<12&4294967295|u>>>20),u=h+(l^f&(o^l))+c[2]+606105819&4294967295,h=f+(u<<17&4294967295|u>>>15),u=l+(o^h&(f^o))+c[3]+3250441966&4294967295,l=h+(u<<22&4294967295|u>>>10),u=o+(f^l&(h^f))+c[4]+4118548399&4294967295,o=l+(u<<7&4294967295|u>>>25),u=f+(h^o&(l^h))+c[5]+1200080426&4294967295,f=o+(u<<12&4294967295|u>>>20),u=h+(l^f&(o^l))+c[6]+2821735955&4294967295,h=f+(u<<17&4294967295|u>>>15),u=l+(o^h&(f^o))+c[7]+4249261313&4294967295,l=h+(u<<22&4294967295|u>>>10),u=o+(f^l&(h^f))+c[8]+1770035416&4294967295,o=l+(u<<7&4294967295|u>>>25),u=f+(h^o&(l^h))+c[9]+2336552879&4294967295,f=o+(u<<12&4294967295|u>>>20),u=h+(l^f&(o^l))+c[10]+4294925233&4294967295,h=f+(u<<17&4294967295|u>>>15),u=l+(o^h&(f^o))+c[11]+2304563134&4294967295,l=h+(u<<22&4294967295|u>>>10),u=o+(f^l&(h^f))+c[12]+1804603682&4294967295,o=l+(u<<7&4294967295|u>>>25),u=f+(h^o&(l^h))+c[13]+4254626195&4294967295,f=o+(u<<12&4294967295|u>>>20),u=h+(l^f&(o^l))+c[14]+2792965006&4294967295,h=f+(u<<17&4294967295|u>>>15),u=l+(o^h&(f^o))+c[15]+1236535329&4294967295,l=h+(u<<22&4294967295|u>>>10),u=o+(h^f&(l^h))+c[1]+4129170786&4294967295,o=l+(u<<5&4294967295|u>>>27),u=f+(l^h&(o^l))+c[6]+3225465664&4294967295,f=o+(u<<9&4294967295|u>>>23),u=h+(o^l&(f^o))+c[11]+643717713&4294967295,h=f+(u<<14&4294967295|u>>>18),u=l+(f^o&(h^f))+c[0]+3921069994&4294967295,l=h+(u<<20&4294967295|u>>>12),u=o+(h^f&(l^h))+c[5]+3593408605&4294967295,o=l+(u<<5&4294967295|u>>>27),u=f+(l^h&(o^l))+c[10]+38016083&4294967295,f=o+(u<<9&4294967295|u>>>23),u=h+(o^l&(f^o))+c[15]+3634488961&4294967295,h=f+(u<<14&4294967295|u>>>18),u=l+(f^o&(h^f))+c[4]+3889429448&4294967295,l=h+(u<<20&4294967295|u>>>12),u=o+(h^f&(l^h))+c[9]+568446438&4294967295,o=l+(u<<5&4294967295|u>>>27),u=f+(l^h&(o^l))+c[14]+3275163606&4294967295,f=o+(u<<9&4294967295|u>>>23),u=h+(o^l&(f^o))+c[3]+4107603335&4294967295,h=f+(u<<14&4294967295|u>>>18),u=l+(f^o&(h^f))+c[8]+1163531501&4294967295,l=h+(u<<20&4294967295|u>>>12),u=o+(h^f&(l^h))+c[13]+2850285829&4294967295,o=l+(u<<5&4294967295|u>>>27),u=f+(l^h&(o^l))+c[2]+4243563512&4294967295,f=o+(u<<9&4294967295|u>>>23),u=h+(o^l&(f^o))+c[7]+1735328473&4294967295,h=f+(u<<14&4294967295|u>>>18),u=l+(f^o&(h^f))+c[12]+2368359562&4294967295,l=h+(u<<20&4294967295|u>>>12),u=o+(l^h^f)+c[5]+4294588738&4294967295,o=l+(u<<4&4294967295|u>>>28),u=f+(o^l^h)+c[8]+2272392833&4294967295,f=o+(u<<11&4294967295|u>>>21),u=h+(f^o^l)+c[11]+1839030562&4294967295,h=f+(u<<16&4294967295|u>>>16),u=l+(h^f^o)+c[14]+4259657740&4294967295,l=h+(u<<23&4294967295|u>>>9),u=o+(l^h^f)+c[1]+2763975236&4294967295,o=l+(u<<4&4294967295|u>>>28),u=f+(o^l^h)+c[4]+1272893353&4294967295,f=o+(u<<11&4294967295|u>>>21),u=h+(f^o^l)+c[7]+4139469664&4294967295,h=f+(u<<16&4294967295|u>>>16),u=l+(h^f^o)+c[10]+3200236656&4294967295,l=h+(u<<23&4294967295|u>>>9),u=o+(l^h^f)+c[13]+681279174&4294967295,o=l+(u<<4&4294967295|u>>>28),u=f+(o^l^h)+c[0]+3936430074&4294967295,f=o+(u<<11&4294967295|u>>>21),u=h+(f^o^l)+c[3]+3572445317&4294967295,h=f+(u<<16&4294967295|u>>>16),u=l+(h^f^o)+c[6]+76029189&4294967295,l=h+(u<<23&4294967295|u>>>9),u=o+(l^h^f)+c[9]+3654602809&4294967295,o=l+(u<<4&4294967295|u>>>28),u=f+(o^l^h)+c[12]+3873151461&4294967295,f=o+(u<<11&4294967295|u>>>21),u=h+(f^o^l)+c[15]+530742520&4294967295,h=f+(u<<16&4294967295|u>>>16),u=l+(h^f^o)+c[2]+3299628645&4294967295,l=h+(u<<23&4294967295|u>>>9),u=o+(h^(l|~f))+c[0]+4096336452&4294967295,o=l+(u<<6&4294967295|u>>>26),u=f+(l^(o|~h))+c[7]+1126891415&4294967295,f=o+(u<<10&4294967295|u>>>22),u=h+(o^(f|~l))+c[14]+2878612391&4294967295,h=f+(u<<15&4294967295|u>>>17),u=l+(f^(h|~o))+c[5]+4237533241&4294967295,l=h+(u<<21&4294967295|u>>>11),u=o+(h^(l|~f))+c[12]+1700485571&4294967295,o=l+(u<<6&4294967295|u>>>26),u=f+(l^(o|~h))+c[3]+2399980690&4294967295,f=o+(u<<10&4294967295|u>>>22),u=h+(o^(f|~l))+c[10]+4293915773&4294967295,h=f+(u<<15&4294967295|u>>>17),u=l+(f^(h|~o))+c[1]+2240044497&4294967295,l=h+(u<<21&4294967295|u>>>11),u=o+(h^(l|~f))+c[8]+1873313359&4294967295,o=l+(u<<6&4294967295|u>>>26),u=f+(l^(o|~h))+c[15]+4264355552&4294967295,f=o+(u<<10&4294967295|u>>>22),u=h+(o^(f|~l))+c[6]+2734768916&4294967295,h=f+(u<<15&4294967295|u>>>17),u=l+(f^(h|~o))+c[13]+1309151649&4294967295,l=h+(u<<21&4294967295|u>>>11),u=o+(h^(l|~f))+c[4]+4149444226&4294967295,o=l+(u<<6&4294967295|u>>>26),u=f+(l^(o|~h))+c[11]+3174756917&4294967295,f=o+(u<<10&4294967295|u>>>22),u=h+(o^(f|~l))+c[2]+718787259&4294967295,h=f+(u<<15&4294967295|u>>>17),u=l+(f^(h|~o))+c[9]+3951481745&4294967295,d.g[0]=d.g[0]+o&4294967295,d.g[1]=d.g[1]+(h+(u<<21&4294967295|u>>>11))&4294967295,d.g[2]=d.g[2]+h&4294967295,d.g[3]=d.g[3]+f&4294967295}n.prototype.u=function(d,o){o===void 0&&(o=d.length);for(var l=o-this.blockSize,c=this.B,h=this.h,f=0;f<o;){if(h==0)for(;f<=l;)i(this,d,f),f+=this.blockSize;if(typeof d=="string"){for(;f<o;)if(c[h++]=d.charCodeAt(f++),h==this.blockSize){i(this,c),h=0;break}}else for(;f<o;)if(c[h++]=d[f++],h==this.blockSize){i(this,c),h=0;break}}this.h=h,this.o+=o},n.prototype.v=function(){var d=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);d[0]=128;for(var o=1;o<d.length-8;++o)d[o]=0;var l=8*this.o;for(o=d.length-8;o<d.length;++o)d[o]=l&255,l/=256;for(this.u(d),d=Array(16),o=l=0;4>o;++o)for(var c=0;32>c;c+=8)d[l++]=this.g[o]>>>c&255;return d};function s(d,o){var l=p;return Object.prototype.hasOwnProperty.call(l,d)?l[d]:l[d]=o(d)}function a(d,o){this.h=o;for(var l=[],c=!0,h=d.length-1;0<=h;h--){var f=d[h]|0;c&&f==o||(l[h]=f,c=!1)}this.g=l}var p={};function m(d){return-128<=d&&128>d?s(d,function(o){return new a([o|0],0>o?-1:0)}):new a([d|0],0>d?-1:0)}function _(d){if(isNaN(d)||!isFinite(d))return T;if(0>d)return V(_(-d));for(var o=[],l=1,c=0;d>=l;c++)o[c]=d/l|0,l*=4294967296;return new a(o,0)}function g(d,o){if(d.length==0)throw Error("number format error: empty string");if(o=o||10,2>o||36<o)throw Error("radix out of range: "+o);if(d.charAt(0)=="-")return V(g(d.substring(1),o));if(0<=d.indexOf("-"))throw Error('number format error: interior "-" character');for(var l=_(Math.pow(o,8)),c=T,h=0;h<d.length;h+=8){var f=Math.min(8,d.length-h),u=parseInt(d.substring(h,h+f),o);8>f?(f=_(Math.pow(o,f)),c=c.j(f).add(_(u))):(c=c.j(l),c=c.add(_(u)))}return c}var T=m(0),v=m(1),P=m(16777216);r=a.prototype,r.m=function(){if(R(this))return-V(this).m();for(var d=0,o=1,l=0;l<this.g.length;l++){var c=this.i(l);d+=(0<=c?c:4294967296+c)*o,o*=4294967296}return d},r.toString=function(d){if(d=d||10,2>d||36<d)throw Error("radix out of range: "+d);if(A(this))return"0";if(R(this))return"-"+V(this).toString(d);for(var o=_(Math.pow(d,6)),l=this,c="";;){var h=Q(l,o).g;l=H(l,h.j(o));var f=((0<l.g.length?l.g[0]:l.h)>>>0).toString(d);if(l=h,A(l))return f+c;for(;6>f.length;)f="0"+f;c=f+c}},r.i=function(d){return 0>d?0:d<this.g.length?this.g[d]:this.h};function A(d){if(d.h!=0)return!1;for(var o=0;o<d.g.length;o++)if(d.g[o]!=0)return!1;return!0}function R(d){return d.h==-1}r.l=function(d){return d=H(this,d),R(d)?-1:A(d)?0:1};function V(d){for(var o=d.g.length,l=[],c=0;c<o;c++)l[c]=~d.g[c];return new a(l,~d.h).add(v)}r.abs=function(){return R(this)?V(this):this},r.add=function(d){for(var o=Math.max(this.g.length,d.g.length),l=[],c=0,h=0;h<=o;h++){var f=c+(this.i(h)&65535)+(d.i(h)&65535),u=(f>>>16)+(this.i(h)>>>16)+(d.i(h)>>>16);c=u>>>16,f&=65535,u&=65535,l[h]=u<<16|f}return new a(l,l[l.length-1]&-2147483648?-1:0)};function H(d,o){return d.add(V(o))}r.j=function(d){if(A(this)||A(d))return T;if(R(this))return R(d)?V(this).j(V(d)):V(V(this).j(d));if(R(d))return V(this.j(V(d)));if(0>this.l(P)&&0>d.l(P))return _(this.m()*d.m());for(var o=this.g.length+d.g.length,l=[],c=0;c<2*o;c++)l[c]=0;for(c=0;c<this.g.length;c++)for(var h=0;h<d.g.length;h++){var f=this.i(c)>>>16,u=this.i(c)&65535,it=d.i(h)>>>16,Ke=d.i(h)&65535;l[2*c+2*h]+=u*Ke,Y(l,2*c+2*h),l[2*c+2*h+1]+=f*Ke,Y(l,2*c+2*h+1),l[2*c+2*h+1]+=u*it,Y(l,2*c+2*h+1),l[2*c+2*h+2]+=f*it,Y(l,2*c+2*h+2)}for(c=0;c<o;c++)l[c]=l[2*c+1]<<16|l[2*c];for(c=o;c<2*o;c++)l[c]=0;return new a(l,0)};function Y(d,o){for(;(d[o]&65535)!=d[o];)d[o+1]+=d[o]>>>16,d[o]&=65535,o++}function rt(d,o){this.g=d,this.h=o}function Q(d,o){if(A(o))throw Error("division by zero");if(A(d))return new rt(T,T);if(R(d))return o=Q(V(d),o),new rt(V(o.g),V(o.h));if(R(o))return o=Q(d,V(o)),new rt(V(o.g),o.h);if(30<d.g.length){if(R(d)||R(o))throw Error("slowDivide_ only works with positive integers.");for(var l=v,c=o;0>=c.l(d);)l=nt(l),c=nt(c);var h=wt(l,1),f=wt(c,1);for(c=wt(c,2),l=wt(l,2);!A(c);){var u=f.add(c);0>=u.l(d)&&(h=h.add(l),f=u),c=wt(c,1),l=wt(l,1)}return o=H(d,h.j(o)),new rt(h,o)}for(h=T;0<=d.l(o);){for(l=Math.max(1,Math.floor(d.m()/o.m())),c=Math.ceil(Math.log(l)/Math.LN2),c=48>=c?1:Math.pow(2,c-48),f=_(l),u=f.j(o);R(u)||0<u.l(d);)l-=c,f=_(l),u=f.j(o);A(f)&&(f=v),h=h.add(f),d=H(d,u)}return new rt(h,d)}r.A=function(d){return Q(this,d).h},r.and=function(d){for(var o=Math.max(this.g.length,d.g.length),l=[],c=0;c<o;c++)l[c]=this.i(c)&d.i(c);return new a(l,this.h&d.h)},r.or=function(d){for(var o=Math.max(this.g.length,d.g.length),l=[],c=0;c<o;c++)l[c]=this.i(c)|d.i(c);return new a(l,this.h|d.h)},r.xor=function(d){for(var o=Math.max(this.g.length,d.g.length),l=[],c=0;c<o;c++)l[c]=this.i(c)^d.i(c);return new a(l,this.h^d.h)};function nt(d){for(var o=d.g.length+1,l=[],c=0;c<o;c++)l[c]=d.i(c)<<1|d.i(c-1)>>>31;return new a(l,d.h)}function wt(d,o){var l=o>>5;o%=32;for(var c=d.g.length-l,h=[],f=0;f<c;f++)h[f]=0<o?d.i(f+l)>>>o|d.i(f+l+1)<<32-o:d.i(f+l);return new a(h,d.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=_,a.fromString=g,pr=a}).apply(typeof He<"u"?He:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}O.UNAUTHENTICATED=new O(null),O.GOOGLE_CREDENTIALS=new O("google-credentials-uid"),O.FIRST_PARTY=new O("first-party-uid"),O.MOCK_USER=new O("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let At="11.2.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ot=new cn("@firebase/firestore");function Ei(r){ot.setLogLevel(r)}function at(r,...t){if(ot.logLevel<=Te.DEBUG){const e=t.map(Ee);ot.debug(`Firestore (${At}): ${r}`,...e)}}function Xt(r,...t){if(ot.logLevel<=Te.ERROR){const e=t.map(Ee);ot.error(`Firestore (${At}): ${r}`,...e)}}function mr(r,...t){if(ot.logLevel<=Te.WARN){const e=t.map(Ee);ot.warn(`Firestore (${At}): ${r}`,...e)}}function Ee(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(e){return JSON.stringify(e)}(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function I(r="Unexpected state"){const t=`FIRESTORE (${At}) INTERNAL ASSERTION FAILED: `+r;throw Xt(t),new Error(t)}function L(r,t){r||I()}function ut(r,t){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ye="ok",Ae="cancelled",vt="unknown",w="invalid-argument",_r="deadline-exceeded",Ie="not-found",mn="already-exists",gr="permission-denied",zt="unauthenticated",yr="resource-exhausted",J="failed-precondition",Ve="aborted",wr="out-of-range",Pe="unimplemented",vr="internal",Tr="unavailable",_n="data-loss";class y extends on{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Er{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class gn{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(O.UNAUTHENTICATED))}shutdown(){}}class yn{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class wn{constructor(t){this.auth=null,t.onInit(e=>{this.auth=e})}getToken(){return this.auth?this.auth.getToken().then(t=>t?(L(typeof t.accessToken=="string"),new Er(t.accessToken,new O(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(t,e){}shutdown(){}}class vn{constructor(t,e,n){this.t=t,this.i=e,this.o=n,this.type="FirstParty",this.user=O.FIRST_PARTY,this.u=new Map}l(){return this.o?this.o():null}get headers(){this.u.set("X-Goog-AuthUser",this.t);const t=this.l();return t&&this.u.set("Authorization",t),this.i&&this.u.set("X-Goog-Iam-Authorization-Token",this.i),this.u}}class Tn{constructor(t,e,n){this.t=t,this.i=e,this.o=n}getToken(){return Promise.resolve(new vn(this.t,this.i,this.o))}start(t,e){t.enqueueRetryable(()=>e(O.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class En{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class An{constructor(t){this.h=t,this.appCheck=null,t.onInit(e=>{this.appCheck=e})}getToken(){return this.appCheck?this.appCheck.getToken().then(t=>t?(L(typeof t.token=="string"),new En(t.token)):null):Promise.resolve(null)}invalidateToken(){}start(t,e){}shutdown(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(t,e,n,i,s,a,p,m,_){this.databaseId=t,this.appId=e,this.persistenceKey=n,this.host=i,this.ssl=s,this.forceLongPolling=a,this.autoDetectLongPolling=p,this.longPollingOptions=m,this.useFetchStreams=_}}class St{constructor(t,e){this.projectId=t,this.database=e||"(default)"}static empty(){return new St("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(t){return t instanceof St&&t.projectId===this.projectId&&t.database===this.database}}class K{constructor(t,e,n){e===void 0?e=0:e>t.length&&I(),n===void 0?n=t.length-e:n>t.length-e&&I(),this.segments=t,this.offset=e,this.len=n}get length(){return this.len}isEqual(t){return K.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof K?t.forEach(n=>{e.push(n)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,n=this.limit();e<n;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const n=Math.min(t.length,e.length);for(let i=0;i<n;i++){const s=K.compareSegments(t.get(i),e.get(i));if(s!==0)return s}return Math.sign(t.length-e.length)}static compareSegments(t,e){const n=K.isNumericId(t),i=K.isNumericId(e);return n&&!i?-1:!n&&i?1:n&&i?K.extractNumericId(t).compare(K.extractNumericId(e)):t<e?-1:t>e?1:0}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return pr.fromString(t.substring(4,t.length-2))}}class b extends K{construct(t,e,n){return new b(t,e,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const n of t){if(n.indexOf("//")>=0)throw new y(w,`Invalid segment (${n}). Paths must not contain // in them.`);e.push(...n.split("/").filter(i=>i.length>0))}return new b(e)}static emptyPath(){return new b([])}}const Vn=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class M extends K{construct(t,e,n){return new M(t,e,n)}static isValidIdentifier(t){return Vn.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),M.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new M(["__name__"])}static fromServerFormat(t){const e=[];let n="",i=0;const s=()=>{if(n.length===0)throw new y(w,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(n),n=""};let a=!1;for(;i<t.length;){const p=t[i];if(p==="\\"){if(i+1===t.length)throw new y(w,"Path has trailing escape character: "+t);const m=t[i+1];if(m!=="\\"&&m!=="."&&m!=="`")throw new y(w,"Path has invalid escape sequence: "+t);n+=m,i+=2}else p==="`"?(a=!a,i++):p!=="."||a?(n+=p,i++):(s(),i++)}if(s(),a)throw new y(w,"Unterminated ` in path: "+t);return new M(e)}static emptyPath(){return new M([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class F{constructor(t){this.path=t}static fromPath(t){return new F(b.fromString(t))}static fromName(t){return new F(b.fromString(t).popFirst(5))}static empty(){return new F(b.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&b.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return b.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new F(new b(t.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function be(r,t,e){if(!e)throw new y(w,`Function ${r}() cannot be called with an empty ${t}.`)}function Je(r){if(!F.isDocumentKey(r))throw new y(w,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Xe(r){if(F.isDocumentKey(r))throw new y(w,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Zt(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const t=function(n){return n.constructor?n.constructor.name:null}(r);return t?`a custom ${t} object`:"an object"}}return typeof r=="function"?"a function":I()}function B(r,t){if("_delegate"in r&&(r=r._delegate),!(r instanceof t)){if(t.name===r.constructor.name)throw new y(w,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=Zt(r);throw new y(w,`Expected type '${t.name}', but it was: ${e}`)}}return r}function Ar(r,t){if(t<=0)throw new y(w,`Function ${r}() requires a positive number, but it was: ${t}.`)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ir(r){const t={};return r.timeoutSeconds!==void 0&&(t.timeoutSeconds=r.timeoutSeconds),t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ut=null;function Pn(){return Ut===null?Ut=function(){return 268435456+Math.round(2147483648*Math.random())}():Ut++,"0x"+Ut.toString(16)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vr(r){return r==null}function Bt(r){return r===0&&1/r==-1/0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rn={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ze,E;function tr(r){if(r===void 0)return Xt("RPC_ERROR","HTTP error has no status"),vt;switch(r){case 200:return Ye;case 400:return J;case 401:return zt;case 403:return gr;case 404:return Ie;case 409:return Ve;case 416:return wr;case 429:return yr;case 499:return Ae;case 500:return vt;case 501:return Pe;case 503:return Tr;case 504:return _r;default:return r>=200&&r<300?Ye:r>=400&&r<500?J:r>=500&&r<600?vr:vt}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(E=Ze||(Ze={}))[E.OK=0]="OK",E[E.CANCELLED=1]="CANCELLED",E[E.UNKNOWN=2]="UNKNOWN",E[E.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",E[E.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",E[E.NOT_FOUND=5]="NOT_FOUND",E[E.ALREADY_EXISTS=6]="ALREADY_EXISTS",E[E.PERMISSION_DENIED=7]="PERMISSION_DENIED",E[E.UNAUTHENTICATED=16]="UNAUTHENTICATED",E[E.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",E[E.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",E[E.ABORTED=10]="ABORTED",E[E.OUT_OF_RANGE=11]="OUT_OF_RANGE",E[E.UNIMPLEMENTED=12]="UNIMPLEMENTED",E[E.INTERNAL=13]="INTERNAL",E[E.UNAVAILABLE=14]="UNAVAILABLE",E[E.DATA_LOSS=15]="DATA_LOSS";class bn extends class{get m(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.A=n+"://"+e.host,this.T=`projects/${i}/databases/${s}`,this.P=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}R(e,n,i,s,a){const p=Pn(),m=this.I(e,n.toUriEncodedString());at("RestConnection",`Sending RPC '${e}' ${p}:`,m,i);const _={"google-cloud-resource-prefix":this.T,"x-goog-request-params":this.P};return this.V(_,s,a),this.p(e,m,_,i).then(g=>(at("RestConnection",`Received RPC '${e}' ${p}: `,g),g),g=>{throw mr("RestConnection",`RPC '${e}' ${p} failed with error: `,g,"url: ",m,"request:",i),g})}g(e,n,i,s,a,p){return this.R(e,n,i,s,a)}V(e,n,i){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+At}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((s,a)=>e[a]=s),i&&i.headers.forEach((s,a)=>e[a]=s)}I(e,n){const i=Rn[e];return`${this.A}/v1/${n}:${i}`}terminate(){}}{F(t,e){throw new Error("Not supported by FetchConnection")}async p(t,e,n,i){var s;const a=JSON.stringify(i);let p;try{p=await fetch(e,{method:"POST",headers:n,body:a})}catch(m){const _=m;throw new y(tr(_.status),"Request failed with error: "+_.statusText)}if(!p.ok){let m=await p.json();Array.isArray(m)&&(m=m[0]);const _=(s=m==null?void 0:m.error)===null||s===void 0?void 0:s.message;throw new y(tr(p.status),`Request failed with error: ${_??p.statusText}`)}return p.json()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(t,e,n){this.alias=t,this.aggregateType=e,this.fieldPath=n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kn(r){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(r);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let n=0;n<r;n++)e[n]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=Math.floor(256/t.length)*t.length;let n="";for(;n.length<20;){const i=kn(40);for(let s=0;s<i.length;++s)n.length<20&&i[s]<e&&(n+=t.charAt(i[s]%t.length))}return n}}function D(r,t){return r<t?-1:r>t?1:0}function Se(r,t,e){return r.length===t.length&&r.every((n,i)=>e(n,t[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function er(r){let t=0;for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t++;return t}function qt(r,t){for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t(e,r[e])}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Dn("Invalid base64 string: "+s):s}}(t);return new X(e)}static fromUint8Array(t){const e=function(i){let s="";for(let a=0;a<i.length;++a)s+=String.fromCharCode(i[a]);return s}(t);return new X(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){const n=new Uint8Array(e.length);for(let i=0;i<e.length;i++)n[i]=e.charCodeAt(i);return n}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return D(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}X.EMPTY_BYTE_STRING=new X("");const Nn=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function lt(r){if(L(!!r),typeof r=="string"){let t=0;const e=Nn.exec(r);if(L(!!e),e[1]){let i=e[1];i=(i+"000000000").substr(0,9),t=Number(i)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:t}}return{seconds:k(r.seconds),nanos:k(r.nanos)}}function k(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function kt(r){return typeof r=="string"?X.fromBase64String(r):X.fromUint8Array(r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ${static now(){return $.fromMillis(Date.now())}static fromDate(t){return $.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),n=Math.floor(1e6*(t-1e3*e));return new $(e,n)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new y(w,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new y(w,"Timestamp nanoseconds out of range: "+e);if(t<-62135596800)throw new y(w,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new y(w,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(t){return this.seconds===t.seconds?D(this.nanoseconds,t.nanoseconds):D(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const t=this.seconds- -62135596800;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ke(r){var t,e;return((e=(((t=r==null?void 0:r.mapValue)===null||t===void 0?void 0:t.fields)||{}).__type__)===null||e===void 0?void 0:e.stringValue)==="server_timestamp"}function Pr(r){const t=r.mapValue.fields.__previous_value__;return ke(t)?Pr(t):t}function Ft(r){const t=lt(r.mapValue.fields.__local_write_time__.timestampValue);return new $(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $t={};function ct(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?ke(r)?4:function(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}(r)?9007199254740991:function(e){var n,i;return((i=(((n=e==null?void 0:e.mapValue)===null||n===void 0?void 0:n.fields)||{}).__type__)===null||i===void 0?void 0:i.stringValue)==="__vector__"}(r)?10:11:I()}function Tt(r,t){if(r===t)return!0;const e=ct(r);if(e!==ct(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===t.booleanValue;case 4:return Ft(r).isEqual(Ft(t));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const a=lt(i.timestampValue),p=lt(s.timestampValue);return a.seconds===p.seconds&&a.nanos===p.nanos}(r,t);case 5:return r.stringValue===t.stringValue;case 6:return function(i,s){return kt(i.bytesValue).isEqual(kt(s.bytesValue))}(r,t);case 7:return r.referenceValue===t.referenceValue;case 8:return function(i,s){return k(i.geoPointValue.latitude)===k(s.geoPointValue.latitude)&&k(i.geoPointValue.longitude)===k(s.geoPointValue.longitude)}(r,t);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return k(i.integerValue)===k(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const a=k(i.doubleValue),p=k(s.doubleValue);return a===p?Bt(a)===Bt(p):isNaN(a)&&isNaN(p)}return!1}(r,t);case 9:return Se(r.arrayValue.values||[],t.arrayValue.values||[],Tt);case 10:case 11:return function(i,s){const a=i.mapValue.fields||{},p=s.mapValue.fields||{};if(er(a)!==er(p))return!1;for(const m in a)if(a.hasOwnProperty(m)&&(p[m]===void 0||!Tt(a[m],p[m])))return!1;return!0}(r,t);default:return I()}}function Dt(r,t){return(r.values||[]).find(e=>Tt(e,t))!==void 0}function Qt(r,t){if(r===t)return 0;const e=ct(r),n=ct(t);if(e!==n)return D(e,n);switch(e){case 0:case 9007199254740991:return 0;case 1:return D(r.booleanValue,t.booleanValue);case 2:return function(s,a){const p=k(s.integerValue||s.doubleValue),m=k(a.integerValue||a.doubleValue);return p<m?-1:p>m?1:p===m?0:isNaN(p)?isNaN(m)?0:-1:1}(r,t);case 3:return rr(r.timestampValue,t.timestampValue);case 4:return rr(Ft(r),Ft(t));case 5:return D(r.stringValue,t.stringValue);case 6:return function(s,a){const p=kt(s),m=kt(a);return p.compareTo(m)}(r.bytesValue,t.bytesValue);case 7:return function(s,a){const p=s.split("/"),m=a.split("/");for(let _=0;_<p.length&&_<m.length;_++){const g=D(p[_],m[_]);if(g!==0)return g}return D(p.length,m.length)}(r.referenceValue,t.referenceValue);case 8:return function(s,a){const p=D(k(s.latitude),k(a.latitude));return p!==0?p:D(k(s.longitude),k(a.longitude))}(r.geoPointValue,t.geoPointValue);case 9:return nr(r.arrayValue,t.arrayValue);case 10:return function(s,a){var p,m,_,g;const T=s.fields||{},v=a.fields||{},P=(p=T.value)===null||p===void 0?void 0:p.arrayValue,A=(m=v.value)===null||m===void 0?void 0:m.arrayValue,R=D(((_=P==null?void 0:P.values)===null||_===void 0?void 0:_.length)||0,((g=A==null?void 0:A.values)===null||g===void 0?void 0:g.length)||0);return R!==0?R:nr(P,A)}(r.mapValue,t.mapValue);case 11:return function(s,a){if(s===$t&&a===$t)return 0;if(s===$t)return 1;if(a===$t)return-1;const p=s.fields||{},m=Object.keys(p),_=a.fields||{},g=Object.keys(_);m.sort(),g.sort();for(let T=0;T<m.length&&T<g.length;++T){const v=D(m[T],g[T]);if(v!==0)return v;const P=Qt(p[m[T]],_[g[T]]);if(P!==0)return P}return D(m.length,g.length)}(r.mapValue,t.mapValue);default:throw I()}}function rr(r,t){if(typeof r=="string"&&typeof t=="string"&&r.length===t.length)return D(r,t);const e=lt(r),n=lt(t),i=D(e.seconds,n.seconds);return i!==0?i:D(e.nanos,n.nanos)}function nr(r,t){const e=r.values||[],n=t.values||[];for(let i=0;i<e.length&&i<n.length;++i){const s=Qt(e[i],n[i]);if(s)return s}return D(e.length,n.length)}function Gt(r,t){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${t.path.canonicalString()}`}}function Rr(r){return!!r&&"arrayValue"in r}function ir(r){return!!r&&"nullValue"in r}function sr(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function de(r){return!!r&&"mapValue"in r}function Pt(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const t={mapValue:{fields:{}}};return qt(r.mapValue.fields,(e,n)=>t.mapValue.fields[e]=Pt(n)),t}if(r.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(r.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=Pt(r.arrayValue.values[e]);return t}return Object.assign({},r)}class Kt{constructor(t,e){this.position=t,this.inclusive=e}}function or(r,t){if(r===null)return t===null;if(t===null||r.inclusive!==t.inclusive||r.position.length!==t.position.length)return!1;for(let e=0;e<r.position.length;e++)if(!Tt(r.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class br{}class j extends br{constructor(t,e,n){super(),this.field=t,this.op=e,this.value=n}static create(t,e,n){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,n):new xn(t,e,n):e==="array-contains"?new On(t,n):e==="in"?new Mn(t,n):e==="not-in"?new Ln(t,n):e==="array-contains-any"?new Un(t,n):new j(t,e,n)}static createKeyFieldInFilter(t,e,n){return e==="in"?new Cn(t,n):new qn(t,n)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&this.matchesComparison(Qt(e,this.value)):e!==null&&ct(this.value)===ct(e)&&this.matchesComparison(Qt(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return I()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ht extends br{constructor(t,e){super(),this.filters=t,this.op=e,this.v=null}static create(t,e){return new ht(t,e)}matches(t){return function(n){return n.op==="and"}(this)?this.filters.find(e=>!e.matches(t))===void 0:this.filters.find(e=>e.matches(t))!==void 0}getFlattenedFilters(){return this.v!==null||(this.v=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.v}getFilters(){return Object.assign([],this.filters)}}function Sr(r,t){return r instanceof j?function(n,i){return i instanceof j&&n.op===i.op&&n.field.isEqual(i.field)&&Tt(n.value,i.value)}(r,t):r instanceof ht?function(n,i){return i instanceof ht&&n.op===i.op&&n.filters.length===i.filters.length?n.filters.reduce((s,a,p)=>s&&Sr(a,i.filters[p]),!0):!1}(r,t):void I()}class xn extends j{constructor(t,e,n){super(t,e,n),this.key=F.fromName(n.referenceValue)}matches(t){const e=F.comparator(t.key,this.key);return this.matchesComparison(e)}}class Cn extends j{constructor(t,e){super(t,"in",e),this.keys=kr("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class qn extends j{constructor(t,e){super(t,"not-in",e),this.keys=kr("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function kr(r,t){var e;return(((e=t.arrayValue)===null||e===void 0?void 0:e.values)||[]).map(n=>F.fromName(n.referenceValue))}class On extends j{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return Rr(e)&&Dt(e.arrayValue,this.value)}}class Mn extends j{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&Dt(this.value.arrayValue,e)}}class Ln extends j{constructor(t,e){super(t,"not-in",e)}matches(t){if(Dt(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&!Dt(this.value.arrayValue,e)}}class Un extends j{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!Rr(e)||!e.arrayValue.values)&&e.arrayValue.values.some(n=>Dt(this.value.arrayValue,n))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(t,e="asc"){this.field=t,this.dir=e}}function $n(r,t){return r.dir===t.dir&&r.field.isEqual(t.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{static fromTimestamp(t){return new S(t)}static min(){return new S(new $(0,0))}static max(){return new S(new $(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(t,e){this.comparator=t,this.root=e||C.EMPTY}insert(t,e){return new Ht(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,C.BLACK,null,null))}remove(t){return new Ht(this.comparator,this.root.remove(t,this.comparator).copy(null,null,C.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const n=this.comparator(t,e.key);if(n===0)return e.value;n<0?e=e.left:n>0&&(e=e.right)}return null}indexOf(t){let e=0,n=this.root;for(;!n.isEmpty();){const i=this.comparator(t,n.key);if(i===0)return e+n.left.size;i<0?n=n.left:(e+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,n)=>(t(e,n),!1))}toString(){const t=[];return this.inorderTraversal((e,n)=>(t.push(`${e}:${n}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new jt(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new jt(this.root,t,this.comparator,!1)}getReverseIterator(){return new jt(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new jt(this.root,t,this.comparator,!0)}}class jt{constructor(t,e,n,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!t.isEmpty();)if(s=e?n(t.key,e):1,e&&i&&(s*=-1),s<0)t=this.isReverse?t.left:t.right;else{if(s===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class C{constructor(t,e,n,i,s){this.key=t,this.value=e,this.color=n??C.RED,this.left=i??C.EMPTY,this.right=s??C.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,n,i,s){return new C(t??this.key,e??this.value,n??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,n){let i=this;const s=n(t,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(t,e,n),null):s===0?i.copy(null,e,null,null,null):i.copy(null,null,null,null,i.right.insert(t,e,n)),i.fixUp()}removeMin(){if(this.left.isEmpty())return C.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let n,i=this;if(e(t,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(t,e),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),e(t,i.key)===0){if(i.right.isEmpty())return C.EMPTY;n=i.right.min(),i=i.copy(n.key,n.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(t,e))}return i.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,C.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,C.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw I();const t=this.left.check();if(t!==this.right.check())throw I();return t+(this.isRed()?0:1)}}C.EMPTY=null,C.RED=!0,C.BLACK=!1;C.EMPTY=new class{constructor(){this.size=0}get key(){throw I()}get value(){throw I()}get color(){throw I()}get left(){throw I()}get right(){throw I()}copy(t,e,n,i,s){return this}insert(t,e,n){return new C(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nt{constructor(t){this.comparator=t,this.data=new Ht(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,n)=>(t(e),!1))}forEachInRange(t,e){const n=this.data.getIteratorFrom(t[0]);for(;n.hasNext();){const i=n.getNext();if(this.comparator(i.key,t[1])>=0)return;e(i.key)}}forEachWhile(t,e){let n;for(n=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();n.hasNext();)if(!t(n.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new ar(this.data.getIterator())}getIteratorFrom(t){return new ar(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(n=>{e=e.add(n)}),e}isEqual(t){if(!(t instanceof Nt)||this.size!==t.size)return!1;const e=this.data.getIterator(),n=t.data.getIterator();for(;e.hasNext();){const i=e.getNext().key,s=n.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new Nt(this.comparator);return e.data=t,e}}class ar{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(t){this.fields=t,t.sort(M.comparator)}static empty(){return new dt([])}unionWith(t){let e=new Nt(M.comparator);for(const n of this.fields)e=e.add(n);for(const n of t)e=e.add(n);return new dt(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Se(this.fields,t.fields,(e,n)=>e.isEqual(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(t){this.value=t}static empty(){return new U({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let n=0;n<t.length-1;++n)if(e=(e.mapValue.fields||{})[t.get(n)],!de(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=Pt(e)}setAll(t){let e=M.emptyPath(),n={},i=[];t.forEach((a,p)=>{if(!e.isImmediateParentOf(p)){const m=this.getFieldsMap(e);this.applyChanges(m,n,i),n={},i=[],e=p.popLast()}a?n[p.lastSegment()]=Pt(a):i.push(p.lastSegment())});const s=this.getFieldsMap(e);this.applyChanges(s,n,i)}delete(t){const e=this.field(t.popLast());de(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return Tt(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let n=0;n<t.length;++n){let i=e.mapValue.fields[t.get(n)];de(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},e.mapValue.fields[t.get(n)]=i),e=i}return e.mapValue.fields}applyChanges(t,e,n){qt(e,(i,s)=>t[i]=s);for(const i of n)delete t[i]}clone(){return new U(Pt(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(t,e,n,i,s,a,p){this.key=t,this.documentType=e,this.version=n,this.readTime=i,this.createTime=s,this.data=a,this.documentState=p}static newInvalidDocument(t){return new W(t,0,S.min(),S.min(),S.min(),U.empty(),0)}static newFoundDocument(t,e,n,i){return new W(t,1,e,S.min(),n,i,0)}static newNoDocument(t,e){return new W(t,2,e,S.min(),S.min(),U.empty(),0)}static newUnknownDocument(t,e){return new W(t,3,e,S.min(),S.min(),U.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(S.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=U.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=U.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=S.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof W&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new W(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(t,e=null,n=[],i=[],s=null,a=null,p=null){this.path=t,this.collectionGroup=e,this.orderBy=n,this.filters=i,this.limit=s,this.startAt=a,this.endAt=p,this.D=null}}function ur(r,t=null,e=[],n=[],i=null,s=null,a=null){return new jn(r,t,e,n,i,s,a)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(t,e=null,n=[],i=[],s=null,a="F",p=null,m=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=n,this.filters=i,this.limit=s,this.limitType=a,this.startAt=p,this.endAt=m,this.C=null,this.S=null,this.N=null,this.startAt,this.endAt}}function Fr(r){return r.collectionGroup!==null}function Dr(r){const t=ut(r);if(t.C===null){t.C=[];const e=new Set;for(const s of t.explicitOrderBy)t.C.push(s),e.add(s.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(a){let p=new Nt(M.comparator);return a.filters.forEach(m=>{m.getFlattenedFilters().forEach(_=>{_.isInequality()&&(p=p.add(_.field))})}),p})(t).forEach(s=>{e.has(s.canonicalString())||s.isKeyField()||t.C.push(new Wt(s,n))}),e.has(M.keyField().canonicalString())||t.C.push(new Wt(M.keyField(),n))}return t.C}function pe(r){const t=ut(r);return t.S||(t.S=Nr(t,Dr(r))),t.S}function Nr(r,t){if(r.limitType==="F")return ur(r.path,r.collectionGroup,t,r.filters,r.limit,r.startAt,r.endAt);{t=t.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new Wt(i.field,s)});const e=r.endAt?new Kt(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Kt(r.startAt.position,r.startAt.inclusive):null;return ur(r.path,r.collectionGroup,t,r.filters,r.limit,e,n)}}function me(r,t){const e=r.filters.concat([t]);return new pt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),e,r.limit,r.limitType,r.startAt,r.endAt)}function zn(r,t){return function(n,i){if(n.limit!==i.limit||n.orderBy.length!==i.orderBy.length)return!1;for(let s=0;s<n.orderBy.length;s++)if(!$n(n.orderBy[s],i.orderBy[s]))return!1;if(n.filters.length!==i.filters.length)return!1;for(let s=0;s<n.filters.length;s++)if(!Sr(n.filters[s],i.filters[s]))return!1;return n.collectionGroup===i.collectionGroup&&!!n.path.isEqual(i.path)&&!!or(n.startAt,i.startAt)&&or(n.endAt,i.endAt)}(pe(r),pe(t))&&r.limitType===t.limitType}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xr(r,t){if(r.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Bt(t)?"-0":t}}function Cr(r,t){return function(n){return typeof n=="number"&&Number.isInteger(n)&&!Bt(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}(t)?function(n){return{integerValue:""+n}}(t):xr(r,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(){this._=void 0}}class qr extends te{}class Or extends te{constructor(t){super(),this.elements=t}}class Mr extends te{constructor(t){super(),this.elements=t}}class Lr extends te{constructor(t,e){super(),this.serializer=t,this.O=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(t,e){this.field=t,this.transform=e}}class q{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new q}static exists(t){return new q(void 0,t)}static updateTime(t){return new q(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}class re{}class Ur extends re{constructor(t,e,n,i=[]){super(),this.key=t,this.value=e,this.precondition=n,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Fe extends re{constructor(t,e,n,i,s=[]){super(),this.key=t,this.data=e,this.fieldMask=n,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}class ne extends re{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class $r extends re{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bn={asc:"ASCENDING",desc:"DESCENDING"},Qn={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Gn={and:"AND",or:"OR"};class Kn{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function _e(r,t){return r.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Wn(r,t){return r.useProto3Json?t.toBase64():t.toUint8Array()}function Hn(r,t){return _e(r,t.toTimestamp())}function Rt(r){return L(!!r),S.fromTimestamp(function(e){const n=lt(e);return new $(n.seconds,n.nanos)}(r))}function De(r,t){return ge(r,t).canonicalString()}function ge(r,t){const e=function(i){return new b(["projects",i.projectId,"databases",i.database])}(r).child("documents");return t===void 0?e:e.child(t)}function Yt(r,t){return De(r.databaseId,t.path)}function ye(r,t){const e=function(i){const s=b.fromString(i);return L(Br(s)),s}(t);if(e.get(1)!==r.databaseId.projectId)throw new y(w,"Tried to deserialize key from different project: "+e.get(1)+" vs "+r.databaseId.projectId);if(e.get(3)!==r.databaseId.database)throw new y(w,"Tried to deserialize key from different database: "+e.get(3)+" vs "+r.databaseId.database);return new F(function(i){return L(i.length>4&&i.get(4)==="documents"),i.popFirst(5)}(e))}function lr(r,t,e){return{name:Yt(r,t),fields:e.value.mapValue.fields}}function Yn(r,t){return"found"in t?function(n,i){L(!!i.found),i.found.name,i.found.updateTime;const s=ye(n,i.found.name),a=Rt(i.found.updateTime),p=i.found.createTime?Rt(i.found.createTime):S.min(),m=new U({mapValue:{fields:i.found.fields}});return W.newFoundDocument(s,a,p,m)}(r,t):"missing"in t?function(n,i){L(!!i.missing),L(!!i.readTime);const s=ye(n,i.missing),a=Rt(i.readTime);return W.newNoDocument(s,a)}(r,t):I()}function Jn(r,t){let e;if(t instanceof Ur)e={update:lr(r,t.key,t.value)};else if(t instanceof ne)e={delete:Yt(r,t.key)};else if(t instanceof Fe)e={update:lr(r,t.key,t.data),updateMask:ei(t.fieldMask)};else{if(!(t instanceof $r))return I();e={verify:Yt(r,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map(n=>function(s,a){const p=a.transform;if(p instanceof qr)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(p instanceof Or)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:p.elements}};if(p instanceof Mr)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:p.elements}};if(p instanceof Lr)return{fieldPath:a.field.canonicalString(),increment:p.O};throw I()}(0,n))),t.precondition.isNone||(e.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:Hn(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:I()}(r,t.precondition)),e}function jr(r,t){const e={structuredQuery:{}},n=t.path;let i;t.collectionGroup!==null?(i=n,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=n.popLast(),e.structuredQuery.from=[{collectionId:n.lastSegment()}]),e.parent=function(_,g){return De(_.databaseId,g)}(r,i);const s=function(_){if(_.length!==0)return zr(ht.create(_,"and"))}(t.filters);s&&(e.structuredQuery.where=s);const a=function(_){if(_.length!==0)return _.map(g=>function(v){return{field:et(v.field),direction:Xn(v.dir)}}(g))}(t.orderBy);a&&(e.structuredQuery.orderBy=a);const p=function(_,g){return _.useProto3Json||Vr(g)?g:{value:g}}(r,t.limit);return p!==null&&(e.structuredQuery.limit=p),t.startAt&&(e.structuredQuery.startAt=function(_){return{before:_.inclusive,values:_.position}}(t.startAt)),t.endAt&&(e.structuredQuery.endAt=function(_){return{before:!_.inclusive,values:_.position}}(t.endAt)),{q:e,parent:i}}function Xn(r){return Bn[r]}function Zn(r){return Qn[r]}function ti(r){return Gn[r]}function et(r){return{fieldPath:r.canonicalString()}}function zr(r){return r instanceof j?function(e){if(e.op==="=="){if(sr(e.value))return{unaryFilter:{field:et(e.field),op:"IS_NAN"}};if(ir(e.value))return{unaryFilter:{field:et(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(sr(e.value))return{unaryFilter:{field:et(e.field),op:"IS_NOT_NAN"}};if(ir(e.value))return{unaryFilter:{field:et(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:et(e.field),op:Zn(e.op),value:e.value}}}(r):r instanceof ht?function(e){const n=e.getFilters().map(i=>zr(i));return n.length===1?n[0]:{compositeFilter:{op:ti(e.op),filters:n}}}(r):I()}function ei(r){const t=[];return r.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function Br(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ne(r){return new Kn(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qr{constructor(t,e,n=1e3,i=1.5,s=6e4){this.B=t,this.timerId=e,this.$=n,this.L=i,this.M=s,this.k=0,this.U=null,this.j=Date.now(),this.reset()}reset(){this.k=0}W(){this.k=this.M}K(t){this.cancel();const e=Math.floor(this.k+this.G()),n=Math.max(0,Date.now()-this.j),i=Math.max(0,e-n);i>0&&at("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.k} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`),this.U=this.B.enqueueAfterDelay(this.timerId,i,()=>(this.j=Date.now(),t())),this.k*=this.L,this.k<this.$&&(this.k=this.$),this.k>this.M&&(this.k=this.M)}H(){this.U!==null&&(this.U.skipDelay(),this.U=null)}cancel(){this.U!==null&&(this.U.cancel(),this.U=null)}G(){return(Math.random()-.5)*this.k}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ri extends class{}{constructor(t,e,n,i){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=n,this.serializer=i,this.J=!1}Y(){if(this.J)throw new y(J,"The client has already been terminated.")}R(t,e,n,i){return this.Y(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.R(t,ge(e,n),i,s,a)).catch(s=>{throw s.name==="FirebaseError"?(s.code===zt&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new y(vt,s.toString())})}g(t,e,n,i,s){return this.Y(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,p])=>this.connection.g(t,ge(e,n),i,a,p,s)).catch(a=>{throw a.name==="FirebaseError"?(a.code===zt&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new y(vt,a.toString())})}terminate(){this.J=!0,this.connection.terminate()}}async function It(r,t){const e=ut(r),n={writes:t.map(i=>Jn(e.serializer,i))};await e.R("Commit",e.serializer.databaseId,b.emptyPath(),n)}async function Gr(r,t){const e=ut(r),n={documents:t.map(p=>Yt(e.serializer,p))},i=await e.g("BatchGetDocuments",e.serializer.databaseId,b.emptyPath(),n,t.length),s=new Map;i.forEach(p=>{const m=Yn(e.serializer,p);s.set(m.key.toString(),m)});const a=[];return t.forEach(p=>{const m=s.get(p.toString());L(!!m),a.push(m)}),a}async function ni(r,t){const e=ut(r),{q:n,parent:i}=jr(e.serializer,pe(t));return(await e.g("RunQuery",e.serializer.databaseId,i,{structuredQuery:n.structuredQuery})).filter(s=>!!s.document).map(s=>function(p,m,_){const g=ye(p,m.name),T=Rt(m.updateTime),v=m.createTime?Rt(m.createTime):S.min(),P=new U({mapValue:{fields:m.fields}}),A=W.newFoundDocument(g,T,v,P);return _?A.setHasCommittedMutations():A}(e.serializer,s.document,void 0))}async function ii(r,t,e){var n;const i=ut(r),{request:s,Z:a,parent:p}=function(T,v,P,A){const{q:R,parent:V}=jr(T,v),H={},Y=[];let rt=0;return P.forEach(Q=>{const nt="aggregate_"+rt++;H[nt]=Q.alias,Q.aggregateType==="count"?Y.push({alias:nt,count:{}}):Q.aggregateType==="avg"?Y.push({alias:nt,avg:{field:et(Q.fieldPath)}}):Q.aggregateType==="sum"&&Y.push({alias:nt,sum:{field:et(Q.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:Y,structuredQuery:R.structuredQuery},parent:R.parent},Z:H,parent:V}}(i.serializer,function(T){const v=ut(T);return v.N||(v.N=Nr(v,T.explicitOrderBy)),v.N}(t),e);i.connection.m||delete s.parent;const m=(await i.g("RunAggregationQuery",i.serializer.databaseId,p,s,1)).filter(g=>!!g.result);L(m.length===1);const _=(n=m[0].result)===null||n===void 0?void 0:n.aggregateFields;return Object.keys(_).reduce((g,T)=>(g[a[T]]=_[T],g),{})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bt=new Map;function Z(r){if(r._terminated)throw new y(J,"The client has already been terminated.");if(!bt.has(r)){at("ComponentProvider","Initializing Datastore");const t=function(s){return new bn(s)}(function(s,a,p,m){return new In(s,a,p,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,Ir(m.experimentalLongPollingOptions),m.useFetchStreams)}(r._databaseId,r.app.options.appId||"",r._persistenceKey,r._freezeSettings())),e=Ne(r._databaseId),n=function(s,a,p,m){return new ri(s,a,p,m)}(r._authCredentials,r._appCheckCredentials,t,e);bt.set(r,n)}return bt.get(r)}class cr{constructor(t){var e,n;if(t.host===void 0){if(t.ssl!==void 0)throw new y(w,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=t.host,this.ssl=(e=t.ssl)===null||e===void 0||e;if(this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<1048576)throw new y(w,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}(function(s,a,p,m){if(a===!0&&m===!0)throw new y(w,`${s} and ${p} cannot be used together.`)})("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Ir((n=t.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new y(w,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new y(w,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new y(w,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&function(n,i){return n.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class tt{constructor(t,e,n,i){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=n,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new cr({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new y(J,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new y(J,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new cr(t),t.credentials!==void 0&&(this._authCredentials=function(n){if(!n)return new gn;switch(n.type){case"firstParty":return new Tn(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new y(w,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const n=bt.get(e);n&&(at("ComponentProvider","Removing Datastore"),bt.delete(e),n.terminate())}(this),Promise.resolve()}}function Pi(r,t,e){e||(e="(default)");const n=fr(r,"firestore/lite");if(n.isInitialized(e))throw new y(J,"Firestore can only be initialized once per app.");return n.initialize({options:t,instanceIdentifier:e})}function Ri(r,t){const e=typeof r=="object"?r:un(),n=typeof r=="string"?r:t||"(default)",i=fr(e,"firestore/lite").getImmediate({identifier:n});if(!i._initialized){const s=ln("firestore");s&&si(i,...s)}return i}function si(r,t,e,n={}){var i;const s=(r=B(r,tt))._getSettings(),a=`${t}:${e}`;if(s.host!=="firestore.googleapis.com"&&s.host!==a&&mr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),r._setSettings(Object.assign(Object.assign({},s),{host:a,ssl:!1})),n.mockUserToken){let p,m;if(typeof n.mockUserToken=="string")p=n.mockUserToken,m=O.MOCK_USER;else{p=an(n.mockUserToken,(i=r._app)===null||i===void 0?void 0:i.options.projectId);const _=n.mockUserToken.sub||n.mockUserToken.user_id;if(!_)throw new y(w,"mockUserToken must contain 'sub' or 'user_id' field!");m=new O(_)}r._authCredentials=new yn(new Er(p,m))}}function bi(r){return r=B(r,tt),hn(r.app,"firestore/lite"),r._delete()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt{constructor(t="count",e){this._internalFieldPath=e,this.type="AggregateField",this.aggregateType=t}}class oi{constructor(t,e,n){this._userDataWriter=e,this._data=n,this.type="AggregateQuerySnapshot",this.query=t}data(){return this._userDataWriter.convertObjectMap(this._data)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(t,e,n){this.converter=e,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new z(this.firestore,t,this._query)}}class x{constructor(t,e,n){this.converter=e,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new G(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new x(this.firestore,t,this._key)}}class G extends z{constructor(t,e,n){super(t,e,function(s){return new pt(s)}(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new x(this.firestore,null,new F(t))}withConverter(t){return new G(this.firestore,t,this._path)}}function Si(r,t,...e){if(r=N(r),be("collection","path",t),r instanceof tt){const n=b.fromString(t,...e);return Xe(n),new G(r,null,n)}{if(!(r instanceof x||r instanceof G))throw new y(w,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(b.fromString(t,...e));return Xe(n),new G(r.firestore,null,n)}}function ki(r,t){if(r=B(r,tt),be("collectionGroup","collection id",t),t.indexOf("/")>=0)throw new y(w,`Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new z(r,null,function(n){return new pt(b.emptyPath(),n)}(t))}function ai(r,t,...e){if(r=N(r),arguments.length===1&&(t=Fn.newId()),be("doc","path",t),r instanceof tt){const n=b.fromString(t,...e);return Je(n),new x(r,null,new F(n))}{if(!(r instanceof x||r instanceof G))throw new y(w,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(b.fromString(t,...e));return Je(n),new x(r.firestore,r instanceof G?r.converter:null,new F(n))}}function Fi(r,t){return r=N(r),t=N(t),(r instanceof x||r instanceof G)&&(t instanceof x||t instanceof G)&&r.firestore===t.firestore&&r.path===t.path&&r.converter===t.converter}function Kr(r,t){return r=N(r),t=N(t),r instanceof z&&t instanceof z&&r.firestore===t.firestore&&zn(r._query,t._query)&&r.converter===t.converter}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Et{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Et(X.fromBase64String(t))}catch(e){throw new y(w,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Et(X.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new y(w,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new M(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}function Di(){return new mt("__name__")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new y(w,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new y(w,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(t){return D(this._lat,t._lat)||D(this._long,t._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie{constructor(t){this._values=(t||[]).map(e=>e)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(n,i){if(n.length!==i.length)return!1;for(let s=0;s<n.length;++s)if(n[s]!==i[s])return!1;return!0}(this._values,t._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ui=/^__.*__$/;class li{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return this.fieldMask!==null?new Fe(t,this.data,this.fieldMask,e,this.fieldTransforms):new Ur(t,this.data,e,this.fieldTransforms)}}class Wr{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return new Fe(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function Hr(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw I()}}class se{constructor(t,e,n,i,s,a){this.settings=t,this.databaseId=e,this.serializer=n,this.ignoreUndefinedProperties=i,s===void 0&&this.X(),this.fieldTransforms=s||[],this.fieldMask=a||[]}get path(){return this.settings.path}get tt(){return this.settings.tt}et(t){return new se(Object.assign(Object.assign({},this.settings),t),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}rt(t){var e;const n=(e=this.path)===null||e===void 0?void 0:e.child(t),i=this.et({path:n,nt:!1});return i.it(t),i}st(t){var e;const n=(e=this.path)===null||e===void 0?void 0:e.child(t),i=this.et({path:n,nt:!1});return i.X(),i}ot(t){return this.et({path:void 0,nt:!0})}ut(t){return Jt(t,this.settings.methodName,this.settings._t||!1,this.path,this.settings.ct)}contains(t){return this.fieldMask.find(e=>t.isPrefixOf(e))!==void 0||this.fieldTransforms.find(e=>t.isPrefixOf(e.field))!==void 0}X(){if(this.path)for(let t=0;t<this.path.length;t++)this.it(this.path.get(t))}it(t){if(t.length===0)throw this.ut("Document fields must not be empty");if(Hr(this.tt)&&ui.test(t))throw this.ut('Document fields cannot begin and end with "__"')}}class ci{constructor(t,e,n){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=n||Ne(t)}lt(t,e,n,i=!1){return new se({tt:t,methodName:e,ct:n,path:M.emptyPath(),nt:!1,_t:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function gt(r){const t=r._freezeSettings(),e=Ne(r._databaseId);return new ci(r._databaseId,!!t.ignoreUndefinedProperties,e)}function oe(r,t,e,n,i,s={}){const a=r.lt(s.merge||s.mergeFields?2:0,t,e,i);$e("Data must be an object, but it was:",a,n);const p=Xr(n,a);let m,_;if(s.merge)m=new dt(a.fieldMask),_=a.fieldTransforms;else if(s.mergeFields){const g=[];for(const T of s.mergeFields){const v=Ct(t,T,e);if(!a.contains(v))throw new y(w,`Field '${v}' is specified in your field mask but missing from your input data.`);tn(g,v)||g.push(v)}m=new dt(g),_=a.fieldTransforms.filter(T=>m.covers(T.field))}else m=null,_=a.fieldTransforms;return new li(new U(p),m,_)}class Ot extends _t{_toFieldTransform(t){if(t.tt!==2)throw t.tt===1?t.ut(`${this._methodName}() can only appear at the top level of your update data`):t.ut(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof Ot}}function Yr(r,t,e){return new se({tt:3,ct:t.settings.ct,methodName:r._methodName,nt:e},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class Ce extends _t{_toFieldTransform(t){return new ee(t.path,new qr)}isEqual(t){return t instanceof Ce}}class qe extends _t{constructor(t,e){super(t),this.ht=e}_toFieldTransform(t){const e=Yr(this,t,!0),n=this.ht.map(s=>yt(s,e)),i=new Or(n);return new ee(t.path,i)}isEqual(t){return t instanceof qe&&ve(this.ht,t.ht)}}class Oe extends _t{constructor(t,e){super(t),this.ht=e}_toFieldTransform(t){const e=Yr(this,t,!0),n=this.ht.map(s=>yt(s,e)),i=new Mr(n);return new ee(t.path,i)}isEqual(t){return t instanceof Oe&&ve(this.ht,t.ht)}}class Me extends _t{constructor(t,e){super(t),this.dt=e}_toFieldTransform(t){const e=new Lr(t.serializer,Cr(t.serializer,this.dt));return new ee(t.path,e)}isEqual(t){return t instanceof Me&&this.dt===t.dt}}function Le(r,t,e,n){const i=r.lt(1,t,e);$e("Data must be an object, but it was:",i,n);const s=[],a=U.empty();qt(n,(m,_)=>{const g=je(t,m,e);_=N(_);const T=i.st(g);if(_ instanceof Ot)s.push(g);else{const v=yt(_,T);v!=null&&(s.push(g),a.set(g,v))}});const p=new dt(s);return new Wr(a,p,i.fieldTransforms)}function Ue(r,t,e,n,i,s){const a=r.lt(1,t,e),p=[Ct(t,n,e)],m=[i];if(s.length%2!=0)throw new y(w,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<s.length;v+=2)p.push(Ct(t,s[v])),m.push(s[v+1]);const _=[],g=U.empty();for(let v=p.length-1;v>=0;--v)if(!tn(_,p[v])){const P=p[v];let A=m[v];A=N(A);const R=a.st(P);if(A instanceof Ot)_.push(P);else{const V=yt(A,R);V!=null&&(_.push(P),g.set(P,V))}}const T=new dt(_);return new Wr(g,T,a.fieldTransforms)}function Jr(r,t,e,n=!1){return yt(e,r.lt(n?4:3,t))}function yt(r,t){if(Zr(r=N(r)))return $e("Unsupported field value:",t,r),Xr(r,t);if(r instanceof _t)return function(n,i){if(!Hr(i.tt))throw i.ut(`${n._methodName}() can only be used with update() and set()`);if(!i.path)throw i.ut(`${n._methodName}() is not currently supported inside arrays`);const s=n._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(r,t),null;if(r===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),r instanceof Array){if(t.settings.nt&&t.tt!==4)throw t.ut("Nested arrays are not supported");return function(n,i){const s=[];let a=0;for(const p of n){let m=yt(p,i.ot(a));m==null&&(m={nullValue:"NULL_VALUE"}),s.push(m),a++}return{arrayValue:{values:s}}}(r,t)}return function(n,i){if((n=N(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Cr(i.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const s=$.fromDate(n);return{timestampValue:_e(i.serializer,s)}}if(n instanceof $){const s=new $(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:_e(i.serializer,s)}}if(n instanceof xe)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof Et)return{bytesValue:Wn(i.serializer,n._byteString)};if(n instanceof x){const s=i.databaseId,a=n.firestore._databaseId;if(!a.isEqual(s))throw i.ut(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:De(n.firestore._databaseId||i.databaseId,n._key.path)}}if(n instanceof ie)return function(a,p){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(m=>{if(typeof m!="number")throw p.ut("VectorValues must only contain numeric values.");return xr(p.serializer,m)})}}}}}}(n,i);throw i.ut(`Unsupported field value: ${Zt(n)}`)}(r,t)}function Xr(r,t){const e={};return function(i){for(const s in i)if(Object.prototype.hasOwnProperty.call(i,s))return!1;return!0}(r)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):qt(r,(n,i)=>{const s=yt(i,t.rt(n));s!=null&&(e[n]=s)}),{mapValue:{fields:e}}}function Zr(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof $||r instanceof xe||r instanceof Et||r instanceof x||r instanceof _t||r instanceof ie)}function $e(r,t,e){if(!Zr(e)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(e)){const n=Zt(e);throw n==="an object"?t.ut(r+" a custom object"):t.ut(r+" "+n)}}function Ct(r,t,e){if((t=N(t))instanceof mt)return t._internalPath;if(typeof t=="string")return je(r,t);throw Jt("Field path arguments must be of type string or ",r,!1,void 0,e)}const hi=new RegExp("[~\\*/\\[\\]]");function je(r,t,e){if(t.search(hi)>=0)throw Jt(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,e);try{return new mt(...t.split("."))._internalPath}catch{throw Jt(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,e)}}function Jt(r,t,e,n,i){const s=n&&!n.isEmpty(),a=i!==void 0;let p=`Function ${t}() called with invalid data`;e&&(p+=" (via `toFirestore()`)"),p+=". ";let m="";return(s||a)&&(m+=" (found",s&&(m+=` in field ${n}`),a&&(m+=` in document ${i}`),m+=")"),new y(w,p+r+m)}function tn(r,t){return r.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(t,e,n,i,s){this._firestore=t,this._userDataWriter=e,this._key=n,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new x(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new en(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(ze("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class en extends ft{data(){return super.data()}}class we{constructor(t,e){this._docs=e,this.query=t}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return this.docs.length===0}forEach(t,e){this._docs.forEach(t,e)}}function di(r,t){return r=N(r),t=N(t),r instanceof ft&&t instanceof ft?r._firestore===t._firestore&&r._key.isEqual(t._key)&&(r._document===null?t._document===null:r._document.isEqual(t._document))&&r._converter===t._converter:r instanceof we&&t instanceof we&&Kr(r.query,t.query)&&Se(r.docs,t.docs,di)}function ze(r,t){return typeof t=="string"?je(r,t):t instanceof mt?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{}class Mt extends Be{}function Ni(r,t,...e){let n=[];t instanceof Be&&n.push(t),n=n.concat(e),function(s){const a=s.filter(m=>m instanceof Vt).length,p=s.filter(m=>m instanceof Lt).length;if(a>1||a>0&&p>0)throw new y(w,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n);for(const i of n)r=i._apply(r);return r}class Lt extends Mt{constructor(t,e,n){super(),this._field=t,this._op=e,this._value=n,this.type="where"}static _create(t,e,n){return new Lt(t,e,n)}_apply(t){const e=this._parse(t);return nn(t._query,e),new z(t.firestore,t.converter,me(t._query,e))}_parse(t){const e=gt(t.firestore);return function(s,a,p,m,_,g,T){let v;if(_.isKeyField()){if(g==="array-contains"||g==="array-contains-any")throw new y(w,`Invalid Query. You can't perform '${g}' queries on documentId().`);if(g==="in"||g==="not-in"){dr(T,g);const P=[];for(const A of T)P.push(hr(m,s,A));v={arrayValue:{values:P}}}else v=hr(m,s,T)}else g!=="in"&&g!=="not-in"&&g!=="array-contains-any"||dr(T,g),v=Jr(p,a,T,g==="in"||g==="not-in");return j.create(_,g,v)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function xi(r,t,e){const n=t,i=ze("where",r);return Lt._create(i,n,e)}class Vt extends Be{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new Vt(t,e)}_parse(t){const e=this._queryConstraints.map(n=>n._parse(t)).filter(n=>n.getFilters().length>0);return e.length===1?e[0]:ht.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:(function(i,s){let a=i;const p=s.getFlattenedFilters();for(const m of p)nn(a,m),a=me(a,m)}(t._query,e),new z(t.firestore,t.converter,me(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function Ci(...r){return r.forEach(t=>sn("or",t)),Vt._create("or",r)}function qi(...r){return r.forEach(t=>sn("and",t)),Vt._create("and",r)}class Qe extends Mt{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new Qe(t,e)}_apply(t){const e=function(i,s,a){if(i.startAt!==null)throw new y(w,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new y(w,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Wt(s,a)}(t._query,this._field,this._direction);return new z(t.firestore,t.converter,function(i,s){const a=i.explicitOrderBy.concat([s]);return new pt(i.path,i.collectionGroup,a,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(t._query,e))}}function Oi(r,t="asc"){const e=t,n=ze("orderBy",r);return Qe._create(n,e)}class ae extends Mt{constructor(t,e,n){super(),this.type=t,this._limit=e,this._limitType=n}static _create(t,e,n){return new ae(t,e,n)}_apply(t){return new z(t.firestore,t.converter,function(n,i,s){return new pt(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),i,s,n.startAt,n.endAt)}(t._query,this._limit,this._limitType))}}function Mi(r){return Ar("limit",r),ae._create("limit",r,"F")}function Li(r){return Ar("limitToLast",r),ae._create("limitToLast",r,"L")}class ue extends Mt{constructor(t,e,n){super(),this.type=t,this._docOrFields=e,this._inclusive=n}static _create(t,e,n){return new ue(t,e,n)}_apply(t){const e=rn(t,this.type,this._docOrFields,this._inclusive);return new z(t.firestore,t.converter,function(i,s){return new pt(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,s,i.endAt)}(t._query,e))}}function Ui(...r){return ue._create("startAt",r,!0)}function $i(...r){return ue._create("startAfter",r,!1)}class le extends Mt{constructor(t,e,n){super(),this.type=t,this._docOrFields=e,this._inclusive=n}static _create(t,e,n){return new le(t,e,n)}_apply(t){const e=rn(t,this.type,this._docOrFields,this._inclusive);return new z(t.firestore,t.converter,function(i,s){return new pt(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,i.startAt,s)}(t._query,e))}}function ji(...r){return le._create("endBefore",r,!1)}function zi(...r){return le._create("endAt",r,!0)}function rn(r,t,e,n){if(e[0]=N(e[0]),e[0]instanceof ft)return function(s,a,p,m,_){if(!m)throw new y(Ie,`Can't use a DocumentSnapshot that doesn't exist for ${p}().`);const g=[];for(const T of Dr(s))if(T.field.isKeyField())g.push(Gt(a,m.key));else{const v=m.data.field(T.field);if(ke(v))throw new y(w,'Invalid query. You are trying to start or end a query using a document for which the field "'+T.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(v===null){const P=T.field.canonicalString();throw new y(w,`Invalid query. You are trying to start or end a query using a document for which the field '${P}' (used as the orderBy) does not exist.`)}g.push(v)}return new Kt(g,_)}(r._query,r.firestore._databaseId,t,e[0]._document,n);{const i=gt(r.firestore);return function(a,p,m,_,g,T){const v=a.explicitOrderBy;if(g.length>v.length)throw new y(w,`Too many arguments provided to ${_}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const P=[];for(let A=0;A<g.length;A++){const R=g[A];if(v[A].field.isKeyField()){if(typeof R!="string")throw new y(w,`Invalid query. Expected a string for document ID in ${_}(), but got a ${typeof R}`);if(!Fr(a)&&R.indexOf("/")!==-1)throw new y(w,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${_}() must be a plain document ID, but '${R}' contains a slash.`);const V=a.path.child(b.fromString(R));if(!F.isDocumentKey(V))throw new y(w,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${_}() must result in a valid document path, but '${V}' is not because it contains an odd number of segments.`);const H=new F(V);P.push(Gt(p,H))}else{const V=Jr(m,_,R);P.push(V)}}return new Kt(P,T)}(r._query,r.firestore._databaseId,i,t,e,n)}}function hr(r,t,e){if(typeof(e=N(e))=="string"){if(e==="")throw new y(w,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Fr(t)&&e.indexOf("/")!==-1)throw new y(w,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const n=t.path.child(b.fromString(e));if(!F.isDocumentKey(n))throw new y(w,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return Gt(r,new F(n))}if(e instanceof x)return Gt(r,e._key);throw new y(w,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Zt(e)}.`)}function dr(r,t){if(!Array.isArray(r)||r.length===0)throw new y(w,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function nn(r,t){const e=function(i,s){for(const a of i)for(const p of a.getFlattenedFilters())if(s.indexOf(p.op)>=0)return p.op;return null}(r.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(e!==null)throw e===t.op?new y(w,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new y(w,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}function sn(r,t){if(!(t instanceof Lt||t instanceof Vt))throw new y(w,`Function ${r}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ce(r,t,e){let n;return n=r?e&&(e.merge||e.mergeFields)?r.toFirestore(t,e):r.toFirestore(t):t,n}class he extends class{convertValue(e,n="none"){switch(ct(e)){case 0:return null;case 1:return e.booleanValue;case 2:return k(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(kt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw I()}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const i={};return qt(e,(s,a)=>{i[s]=this.convertValue(a,n)}),i}convertVectorValue(e){var n,i,s;const a=(s=(i=(n=e.fields)===null||n===void 0?void 0:n.value.arrayValue)===null||i===void 0?void 0:i.values)===null||s===void 0?void 0:s.map(p=>k(p.doubleValue));return new ie(a)}convertGeoPoint(e){return new xe(k(e.latitude),k(e.longitude))}convertArray(e,n){return(e.values||[]).map(i=>this.convertValue(i,n))}convertServerTimestamp(e,n){switch(n){case"previous":const i=Pr(e);return i==null?null:this.convertValue(i,n);case"estimate":return this.convertTimestamp(Ft(e));default:return null}}convertTimestamp(e){const n=lt(e);return new $(n.seconds,n.nanos)}convertDocumentKey(e,n){const i=b.fromString(e);L(Br(i));const s=new St(i.get(1),i.get(3)),a=new F(i.popFirst(5));return s.isEqual(n)||Xt(`Document ${a} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),a}}{constructor(t){super(),this.firestore=t}convertBytes(t){return new Et(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new x(this.firestore,null,e)}}function Qi(r){const t=Z((r=B(r,x)).firestore),e=new he(r.firestore);return Gr(t,[r._key]).then(n=>{L(n.length===1);const i=n[0];return new ft(r.firestore,e,r._key,i.isFoundDocument()?i:null,r.converter)})}function Gi(r){(function(i){if(i.limitType==="L"&&i.explicitOrderBy.length===0)throw new y(Pe,"limitToLast() queries require specifying at least one orderBy() clause")})((r=B(r,z))._query);const t=Z(r.firestore),e=new he(r.firestore);return ni(t,r._query).then(n=>{const i=n.map(s=>new en(r.firestore,e,s.key,s,r.converter));return r._query.limitType==="L"&&i.reverse(),new we(r,i)})}function Ki(r,t,e){const n=ce((r=B(r,x)).converter,t,e),i=oe(gt(r.firestore),"setDoc",r._key,n,r.converter!==null,e);return It(Z(r.firestore),[i.toMutation(r._key,q.none())])}function Wi(r,t,e,...n){const i=gt((r=B(r,x)).firestore);let s;return s=typeof(t=N(t))=="string"||t instanceof mt?Ue(i,"updateDoc",r._key,t,e,n):Le(i,"updateDoc",r._key,t),It(Z(r.firestore),[s.toMutation(r._key,q.exists(!0))])}function Hi(r){return It(Z((r=B(r,x)).firestore),[new ne(r._key,q.none())])}function Yi(r,t){const e=ai(r=B(r,G)),n=ce(r.converter,t),i=oe(gt(r.firestore),"addDoc",e._key,n,e.converter!==null,{});return It(Z(r.firestore),[i.toMutation(e._key,q.exists(!1))]).then(()=>e)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ji(r){return fi(r,{count:pi()})}function fi(r,t){const e=B(r.firestore,tt),n=Z(e),i=function(a,p){const m=[];for(const _ in a)Object.prototype.hasOwnProperty.call(a,_)&&m.push(p(a[_],_,a));return m}(t,(s,a)=>new Sn(a,s.aggregateType,s._internalFieldPath));return ii(n,r._query,i).then(s=>function(p,m,_){const g=new he(p);return new oi(m,g,_)}(e,r,s))}function Xi(r){return new xt("sum",Ct("sum",r))}function Zi(r){return new xt("avg",Ct("average",r))}function pi(){return new xt("count")}function ts(r,t){var e,n;return r instanceof xt&&t instanceof xt&&r.aggregateType===t.aggregateType&&((e=r._internalFieldPath)===null||e===void 0?void 0:e.canonicalString())===((n=t._internalFieldPath)===null||n===void 0?void 0:n.canonicalString())}function es(r,t){return Kr(r.query,t.query)&&ve(r.data(),t.data())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rs(){return new Ot("deleteField")}function ns(){return new Ce("serverTimestamp")}function is(...r){return new qe("arrayUnion",r)}function ss(...r){return new Oe("arrayRemove",r)}function os(r){return new Me("increment",r)}function as(r){return new ie(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mi{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=gt(t)}set(t,e,n){this._verifyNotCommitted();const i=st(t,this._firestore),s=ce(i.converter,e,n),a=oe(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,n);return this._mutations.push(a.toMutation(i._key,q.none())),this}update(t,e,n,...i){this._verifyNotCommitted();const s=st(t,this._firestore);let a;return a=typeof(e=N(e))=="string"||e instanceof mt?Ue(this._dataReader,"WriteBatch.update",s._key,e,n,i):Le(this._dataReader,"WriteBatch.update",s._key,e),this._mutations.push(a.toMutation(s._key,q.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=st(t,this._firestore);return this._mutations=this._mutations.concat(new ne(e._key,q.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new y(J,"A write batch can no longer be used after commit() has been called.")}}function st(r,t){if((r=N(r)).firestore!==t)throw new y(w,"Provided document reference is from a different Firestore instance.");return r}function us(r){const t=Z(r=B(r,tt));return new mi(r,e=>It(t,e))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _i{constructor(t){this.datastore=t,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(t){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new y(w,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const e=await Gr(this.datastore,t);return e.forEach(n=>this.recordVersion(n)),e}set(t,e){this.write(e.toMutation(t,this.precondition(t))),this.writtenDocs.add(t.toString())}update(t,e){try{this.write(e.toMutation(t,this.preconditionForUpdate(t)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(t.toString())}delete(t){this.write(new ne(t,this.precondition(t))),this.writtenDocs.add(t.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const t=this.readVersions;this.mutations.forEach(e=>{t.delete(e.key.toString())}),t.forEach((e,n)=>{const i=F.fromPath(n);this.mutations.push(new $r(i,this.precondition(i)))}),await It(this.datastore,this.mutations),this.committed=!0}recordVersion(t){let e;if(t.isFoundDocument())e=t.version;else{if(!t.isNoDocument())throw I();e=S.min()}const n=this.readVersions.get(t.key.toString());if(n){if(!e.isEqual(n))throw new y(Ve,"Document version changed between two reads.")}else this.readVersions.set(t.key.toString(),e)}precondition(t){const e=this.readVersions.get(t.toString());return!this.writtenDocs.has(t.toString())&&e?e.isEqual(S.min())?q.exists(!1):q.updateTime(e):q.none()}preconditionForUpdate(t){const e=this.readVersions.get(t.toString());if(!this.writtenDocs.has(t.toString())&&e){if(e.isEqual(S.min()))throw new y(w,"Can't update a document that doesn't exist.");return q.updateTime(e)}return q.exists(!0)}write(t){this.ensureCommitNotCalled(),this.mutations.push(t)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gi={maxAttempts:5};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{constructor(t,e,n,i,s){this.asyncQueue=t,this.datastore=e,this.options=n,this.updateFunction=i,this.deferred=s,this.ft=n.maxAttempts,this.Et=new Qr(this.asyncQueue,"transaction_retry")}At(){this.ft-=1,this.Tt()}Tt(){this.Et.K(async()=>{const t=new _i(this.datastore),e=this.Pt(t);e&&e.then(n=>{this.asyncQueue.enqueueAndForget(()=>t.commit().then(()=>{this.deferred.resolve(n)}).catch(i=>{this.Rt(i)}))}).catch(n=>{this.Rt(n)})})}Pt(t){try{const e=this.updateFunction(t);return!Vr(e)&&e.catch&&e.then?e:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(e){return this.deferred.reject(e),null}}Rt(t){this.ft>0&&this.It(t)?(this.ft-=1,this.asyncQueue.enqueueAndForget(()=>(this.Tt(),Promise.resolve()))):this.deferred.reject(t)}It(t){if(t.name==="FirebaseError"){const e=t.code;return e==="aborted"||e==="failed-precondition"||e==="already-exists"||!function(i){switch(i){default:return I();case Ae:case vt:case _r:case yr:case vr:case Tr:case zt:return!1;case w:case Ie:case mn:case gr:case J:case Ve:case wr:case Pe:case _n:return!0}}(e)}return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fe(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ge{constructor(t,e,n,i,s){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=n,this.op=i,this.removalCallback=s,this.deferred=new Re,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,n,i,s){const a=Date.now()+n,p=new Ge(t,e,a,i,s);return p.start(n),p}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new y(Ae,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wi{constructor(t=Promise.resolve()){this.Vt=[],this.yt=!1,this.wt=[],this.gt=null,this.Ft=!1,this.vt=!1,this.Dt=[],this.Et=new Qr(this,"async_queue_retry"),this.bt=()=>{const n=fe();n&&at("AsyncQueue","Visibility state changed to "+n.visibilityState),this.Et.H()},this.Ct=t;const e=fe();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.bt)}get isShuttingDown(){return this.yt}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.St(),this.Nt(t)}enterRestrictedMode(t){if(!this.yt){this.yt=!0,this.vt=t||!1;const e=fe();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.bt)}}enqueue(t){if(this.St(),this.yt)return new Promise(()=>{});const e=new Re;return this.Nt(()=>this.yt&&this.vt?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Vt.push(t),this.Ot()))}async Ot(){if(this.Vt.length!==0){try{await this.Vt[0](),this.Vt.shift(),this.Et.reset()}catch(t){if(!function(n){return n.name==="IndexedDbTransactionError"}(t))throw t;at("AsyncQueue","Operation failed with retryable error: "+t)}this.Vt.length>0&&this.Et.K(()=>this.Ot())}}Nt(t){const e=this.Ct.then(()=>(this.Ft=!0,t().catch(n=>{this.gt=n,this.Ft=!1;const i=function(a){let p=a.message||"";return a.stack&&(p=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),p}(n);throw Xt("INTERNAL UNHANDLED ERROR: ",i),n}).then(n=>(this.Ft=!1,n))));return this.Ct=e,e}enqueueAfterDelay(t,e,n){this.St(),this.Dt.indexOf(t)>-1&&(e=0);const i=Ge.createAndSchedule(this,t,e,n,s=>this.qt(s));return this.wt.push(i),i}St(){this.gt&&I()}verifyOperationInProgress(){}async Bt(){let t;do t=this.Ct,await t;while(t!==this.Ct)}$t(t){for(const e of this.wt)if(e.timerId===t)return!0;return!1}Qt(t){return this.Bt().then(()=>{this.wt.sort((e,n)=>e.targetTimeMs-n.targetTimeMs);for(const e of this.wt)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Bt()})}Lt(t){this.Dt.push(t)}qt(t){const e=this.wt.indexOf(t);this.wt.splice(e,1)}}class vi{constructor(t,e){this._firestore=t,this._transaction=e,this._dataReader=gt(t)}get(t){const e=st(t,this._firestore),n=new he(this._firestore);return this._transaction.lookup([e._key]).then(i=>{if(!i||i.length!==1)return I();const s=i[0];if(s.isFoundDocument())return new ft(this._firestore,n,s.key,s,e.converter);if(s.isNoDocument())return new ft(this._firestore,n,e._key,null,e.converter);throw I()})}set(t,e,n){const i=st(t,this._firestore),s=ce(i.converter,e,n),a=oe(this._dataReader,"Transaction.set",i._key,s,i.converter!==null,n);return this._transaction.set(i._key,a),this}update(t,e,n,...i){const s=st(t,this._firestore);let a;return a=typeof(e=N(e))=="string"||e instanceof mt?Ue(this._dataReader,"Transaction.update",s._key,e,n,i):Le(this._dataReader,"Transaction.update",s._key,e),this._transaction.update(s._key,a),this}delete(t){const e=st(t,this._firestore);return this._transaction.delete(e._key),this}}function ls(r,t,e){const n=Z(r=B(r,tt)),i=Object.assign(Object.assign({},gi),e);(function(p){if(p.maxAttempts<1)throw new y(w,"Max attempts must be at least 1")})(i);const s=new Re;return new yi(function(){return new wi}(),n,i,a=>t(new vi(r,a)),s).At(),s.promise}(function(){(function(e){At=e})(`${dn}_lite`),fn(new pn("firestore/lite",(t,{instanceIdentifier:e,options:n})=>{const i=t.getProvider("app").getImmediate(),s=new tt(new wn(t.getProvider("auth-internal")),new An(t.getProvider("app-check-internal")),function(p,m){if(!Object.prototype.hasOwnProperty.apply(p.options,["projectId"]))throw new y(w,'"projectId" not provided in firebase.initializeApp.');return new St(p.options.projectId,m)}(i,e),i);return n&&s._setSettings(n),s},"PUBLIC").setMultipleInstances(!0)),We("firestore-lite","4.7.6",""),We("firestore-lite","4.7.6","esm2017")})();export{xt as AggregateField,oi as AggregateQuerySnapshot,Et as Bytes,G as CollectionReference,x as DocumentReference,ft as DocumentSnapshot,mt as FieldPath,_t as FieldValue,tt as Firestore,y as FirestoreError,xe as GeoPoint,z as Query,Vt as QueryCompositeFilterConstraint,Mt as QueryConstraint,en as QueryDocumentSnapshot,le as QueryEndAtConstraint,Lt as QueryFieldFilterConstraint,ae as QueryLimitConstraint,Qe as QueryOrderByConstraint,we as QuerySnapshot,ue as QueryStartAtConstraint,$ as Timestamp,vi as Transaction,ie as VectorValue,mi as WriteBatch,Yi as addDoc,ts as aggregateFieldEqual,es as aggregateQuerySnapshotEqual,qi as and,ss as arrayRemove,is as arrayUnion,Zi as average,Si as collection,ki as collectionGroup,si as connectFirestoreEmulator,pi as count,Hi as deleteDoc,rs as deleteField,ai as doc,Di as documentId,zi as endAt,ji as endBefore,fi as getAggregate,Ji as getCount,Qi as getDoc,Gi as getDocs,Ri as getFirestore,os as increment,Pi as initializeFirestore,Mi as limit,Li as limitToLast,Ci as or,Oi as orderBy,Ni as query,Kr as queryEqual,Fi as refEqual,ls as runTransaction,ns as serverTimestamp,Ki as setDoc,Ei as setLogLevel,di as snapshotEqual,$i as startAfter,Ui as startAt,Xi as sum,bi as terminate,Wi as updateDoc,as as vector,xi as where,us as writeBatch};
