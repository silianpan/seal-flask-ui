export const legaFormPrintCss = `
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, form, fieldset, legend, input, textarea, p, blockquote, th, td, hr, button, article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
p {
  display: block;
  -webkit-margin-before: 1em;
  -webkit-margin-after: 1em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
}
body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE\\8F6F\\96C5\\9ED1", Arial, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  background-color: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.ivu-col-span-1,
.ivu-col-span-2,
.ivu-col-span-3,
.ivu-col-span-4,
.ivu-col-span-5,
.ivu-col-span-6,
.ivu-col-span-7,
.ivu-col-span-8,
.ivu-col-span-9,
.ivu-col-span-10,
.ivu-col-span-11,
.ivu-col-span-12,
.ivu-col-span-13,
.ivu-col-span-14,
.ivu-col-span-15,
.ivu-col-span-16,
.ivu-col-span-17,
.ivu-col-span-18,
.ivu-col-span-19,
.ivu-col-span-20,
.ivu-col-span-21,
.ivu-col-span-22,
.ivu-col-span-23,
.ivu-col-span-24 {
  float: left;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
}
.ivu-col {
  position: relative;
  display: block;
}
.ivu-col-span-8 {
  display: block;
  width: 33.33333333%;
}
.ivu-col-span-12 {
  display: block;
  width: 50%;
}
.ivu-col-span-16 {
  display: block;
  width: 66.66666667%;
}
.ivu-col-span-24 {
  display: block;
  width: 100%;
}
.ivu-form-item {
  vertical-align: top;
  zoom: 1;
}
.ivu-form .ivu-form-item-label {
  vertical-align: middle;
  float: left;
  line-height: 1;
  padding: 10px 12px 10px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.ivu-form-item-content {
  position: relative;
  line-height: 32px;
  font-size: 12px;
}
.ivu-form-item:before,
.ivu-form-item:after {
  content: '';
  display: table;
}
.ivu-form-item:after {
  clear: both;
  visibility: hidden;
  font-size: 0;
  height: 0;
}
`
