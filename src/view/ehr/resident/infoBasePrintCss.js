import { legaFormPrintCss } from './legaFormPrintCss'
export const cssText = `
${legaFormPrintCss}
.word-view {
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
.word-view .ivu-row-flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.word-view .ivu-row-flex:not(:last-child) {
  border-bottom: 1px solid #ccc;
}
.word-view .ivu-form-item {
  margin-bottom: 0;
}
.word-view .ivu-form-item label {
  text-align: center;
  border-right: 1px solid #ccc;
  width: 100px;
}
.word-view .ivu-form-item .ivu-form-item-content {
  text-align: center;
  margin-left: 100px;
}
.word-view .ivu-form-item .ivu-form-item-content span {
  color: #303133;
}
.word-view .title {
  padding: 10px 0 10px 0;
  text-align: center;
  border-left: 1px solid #ccc;
}
.word-view .title span {
  color: #464c5b;
  font-size: 16px;
  font-weight: bold;
}
.word-view .word-view-form-item {
  border-left: 1px solid #ccc !important;
}
.word-view-child-label {
  font-size: 14px !important;
}
.ivu-row-flex .ivu-col:not(:first-child) > .word-view-child-form-item {
  border-left: 1px solid #ccc;
}
.bs-callout-small {
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #eee;
  border-left-width: 5px;
  border-radius: 3px;
  padding: 10px;
  margin: 20px 0;
  border: 1px solid #eee;
  border-left-width: 5px;
  border-radius: 3px;
}
.bs-callout-primary {
  border-left-color: #2b85e4;
}
.bs-callout-primary  h4 {
  color: #2b85e4;
}
.id-card-info .info-label {
  margin: 10px;
  padding: 10px;
  font-weight: bold;
  font-size: 14px;
  color: steelblue;
}

.id-card-info .photo {
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: bottom;
  text-align: center;
  position: relative;
  float: right;
  top: 10px;
  width: 100px;
  height: 120px;
}

.id-card-info .ivu-col {
  margin-bottom: 10px;
}
`
