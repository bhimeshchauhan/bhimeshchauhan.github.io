(self.webpackChunkpersonal_website_reach=self.webpackChunkpersonal_website_reach||[]).push([[604],{7984:function(e,t,r){var a,n=Object.create,i=Object.defineProperty,l=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,o=Object.getPrototypeOf,c=Object.prototype.hasOwnProperty,p=(e,t,r,a)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let n of s(t))c.call(e,n)||n===r||i(e,n,{get:()=>t[n],enumerable:!(a=l(t,n))||a.enumerable});return e},u=(e,t,r)=>(((e,t,r)=>{t in e?i(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r})(e,"symbol"!=typeof t?t+"":t,r),r),h={};((e,t)=>{for(var r in t)i(e,r,{get:t[r],enumerable:!0})})(h,{default:()=>g}),e.exports=(a=h,p(i({},"__esModule",{value:!0}),a));var d=((e,t,r)=>(r=null!=e?n(o(e)):{},p(!t&&e&&e.__esModule?r:i(r,"default",{value:e,enumerable:!0}),e)))(r(1504));const m="64px",b={};class g extends d.Component{constructor(){super(...arguments),u(this,"mounted",!1),u(this,"state",{image:null}),u(this,"handleKeyPress",(e=>{"Enter"!==e.key&&" "!==e.key||this.props.onClick()}))}componentDidMount(){this.mounted=!0,this.fetchImage(this.props)}componentDidUpdate(e){const{url:t,light:r}=this.props;e.url===t&&e.light===r||this.fetchImage(this.props)}componentWillUnmount(){this.mounted=!1}fetchImage({url:e,light:t,oEmbedUrl:r}){if(!d.default.isValidElement(t))if("string"!=typeof t){if(!b[e])return this.setState({image:null}),window.fetch(r.replace("{url}",e)).then((e=>e.json())).then((t=>{if(t.thumbnail_url&&this.mounted){const r=t.thumbnail_url.replace("height=100","height=480").replace("-d_295x166","-d_640");this.setState({image:r}),b[e]=r}}));this.setState({image:b[e]})}else this.setState({image:t})}render(){const{light:e,onClick:t,playIcon:r,previewTabIndex:a}=this.props,{image:n}=this.state,i=d.default.isValidElement(e),l={display:"flex",alignItems:"center",justifyContent:"center"},s={preview:{width:"100%",height:"100%",backgroundImage:n&&!i?`url(${n})`:void 0,backgroundSize:"cover",backgroundPosition:"center",cursor:"pointer",...l},shadow:{background:"radial-gradient(rgb(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%)",borderRadius:m,width:m,height:m,position:i?"absolute":void 0,...l},playIcon:{borderStyle:"solid",borderWidth:"16px 0 16px 26px",borderColor:"transparent transparent transparent white",marginLeft:"7px"}},o=d.default.createElement("div",{style:s.shadow,className:"react-player__shadow"},d.default.createElement("div",{style:s.playIcon,className:"react-player__play-icon"}));return d.default.createElement("div",{style:s.preview,className:"react-player__preview",onClick:t,tabIndex:a,onKeyPress:this.handleKeyPress},i?e:null,r||o)}}}}]);
//# sourceMappingURL=reactPlayerPreview-629f95d07a57bd07890f.js.map