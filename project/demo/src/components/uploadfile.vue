<template>
  <div style="height:50px;">
    <h1>文件上传页面</h1>
    <button id="upload" @click="upload()" style="height:50px;width:100px">上传表单</button>
    <el-dialog
        title="导入资产"
        :visible.sync="dialogVisible"
        width="38%"
        height="20px"
        >
        <el-form
        ref="form" 
        :model="form"
        :label-position="labelPosition"
        label-width="120px"
        style="margin-right:15%;margin-left:5%">        
          <el-form-item label="*资产名称:">
            <el-input size="small" v-model="name"></el-input>
          </el-form-item>
          <el-form-item label="*资产文件路径:">
            <el-upload
            ref="uploadref" 
            style="display:inline-block;width:80px" 
            :auto-upload="false"
            webkitdectory
            action="#"
            multiple
            :show-file-list="showfilelist"
            :on-change="dataUpload"
            :on-remove="dataUploadRemove"
            :file-list="fileList1">
              <button size="small" type="info" style="background:transparent;color:white;border:1px white solid">
                <i class="el-icon-upload2"></i>
                上传
              </button>
          </el-upload>
            <el-button style="background:transparent;border:none" @click="">清除</el-button>       
          </el-form-item>
          <el-form-item label="缩略图:">
            <el-upload
            action="#" 
            list-type="picture-card" 
            :auto-upload="false"
            :file-list="fileList"
            :class="{ hide: hideUpload_introduce}"
            :on-change="handleIntroduceUploadHide"
            :on-remove="handleIntroduceUploadShow">
              <span style="position:relative;top:-10px">
                <i class="el-icon-plus"></i>
              </span>
            </el-upload>
          </el-form-item>
          <el-form-item label="资产类型:">
            <select id="group" v-model='asset_type1' placeholder="请选择" style="width:200px;height:30px;background:transparent;color:red">
               <option v-for="item in assetstype" 
                :key='item.value' 
                :label="item.label"
                :value="item.value"></option>
                      </select>
          </el-form-item>
           <el-form-item label="资产备注:">
            <el-input 
            type="textarea"
            :cols="44" 
            :rows="5" 
            style="background: transparent;color:white" 
            v-model="remark">
            </el-input>
          </el-form-item>
          <el-form-item style="width:100%;margin-left:16%">
            <el-button @click="dialogClose()" type="info" size="small">取消</el-button>
            <el-button type="primary" @click="formSubmit()" size="small">确认</el-button>          
          </el-form-item>
        </el-form>
     </el-dialog>
  </div>
</template>

<script>
import SparkMD5 from 'spark-md5'
import axios from 'axios'
export default {
  name:'props92',
  data () {
    return{
      dialogVisible:false,
      labelPosition:'right',
      name:'',
      form:{
             
      },
      uploadref:'',
      chunkSize:0,
      fileList:[],
      fileList1:[],
      showfilelist:true,
      hideUpload_introduce:false,
      limitCount:1,
      assetstype:[{
        value:1,
        label:'资产影像'
      },{
        value:2,
        label:'高程资产'
      },{
        value:3,
        label:'矢量资产'
      },{
        value:4,
        label:'军交矢量资产'
      },{
        value:5,
        label:'OSGB资产'
      },{
        value:6,
        label:'模型切片缓存资产'
      },{
        value:7,
        label:'GIM资产'
      },{
        value:8,
        label:'BIM资产'
      },{
        value:9,
        label:'模型库'
      },{
        value:10,
        label:'图片库'
      },{
        value:11,
        label:'飞机仿真资产'
      },{
        value:12,
        label:'摄像头资产'
      }],
      asset_type1:1,
      remark:'',
      index:'',
      upfile:'',
      upfiles:[],
      files : [],
      units:['B','kb','MB','GB'],
      maxFileSize:600*1024*1024,
      md5:'',
      flag:0,
      upfiles1:[],
      instance:'',
      flagpic:0,
      
    }
  },
  created(){
  this.instance =  axios.create({
       baseURL:'http://127.0.0.1:8085/',
       headers:{
                'Content-Type':'multipart/form-data'
                }
      })
  },
  methods:{
    //  对话框显示
    upload(){
      this.dialogVisible = !this.dialogVisible 
    },
    // 
    dialogClose(){
      this.dialogVisible = false
      this.clearfile()
      // 清空字段
      this.name = ''
      this.asset_type1 = 1   
    },
    // 只显示一个缩略图
    handleIntroduceUploadHide(file,filelist){ 
      this.fileList = filelist
      this.upfiles1 = filelist  
      this.hideUpload_introduce = filelist.length >= this.limitCount  
    },
    handleIntroduceUploadShow(file,fileList){
      this.fileList = fileList
      this.upfiles1 = fileList 
      this.hideUpload_introduce = fileList.length >= this.limitCount
    },
    // 文件上传
    dataUpload(file,fileList){
      this.showfilelist = true
      this.upfiles = fileList
      this.chunkSize = file.size/5
      if(this.maxFileSize > this.maxFileSize){
        this.chunkSize = file.size/ Math.ceil(file.size / this.maxFileSize)
      }       
    },
    // 文件移除
    dataUploadRemove(file,fileList){
      this.upfiles = fileList
    },  
    //  文件夹上传
    handleFileUpload(ev){
      this.upfiles = document.getElementById("file").files;
    },
    // 清除按钮
    clearfile(){
      this.$refs.uploadref.clearFiles();
      this.upfiles = []
      this.upfile = ''
    },
    // 表单提交
    formSubmit(){
      // 资产类型标签
      this.asset_type = this.assetstype[this.asset_type1-1].label;
      //  缩略图上传
      if(this.flagpic < this.upfiles1.length){
              var picform = new FormData()
              picform.append('picform',this.upfiles1[0].raw)
              let url = `http://127.0.0.1:8085/upload?type=pic&md5Val=${this.md5}&name=${this.name}&assettype=${this.asset_type}&remark=${this.remark}&filename=${this.upfiles1[0].name}`
              this.instance.post(url,picform).then(res=>{
      })

      }
      // 文件及其他属性的上传
      if(this.flag < this.upfiles.length){
          this.upfile = this.upfiles[this.flag].raw; 
          var files= this.sliceFile(this.upfile);
          this.md5File(files).then(md5 =>{
              this.md5 = md5
              this.$http.post('upload',{
                type:'check',
                md5Val:this.md5,
                total:files.length,
                name:this.name,
                remark:this.remark,
                assettype:this.asset_type,
              }).then(res=>{
                if(res.data.msg === 'get_succ'){
                  let chunkIndex = res.data.data.index;
                  this.uploadfile1(files,chunkIndex,this.md5)
                }              
              })
            })
      }
      //  所有文件传递完之后的操作
      if(this.flag === this.upfiles.length){
        // 关闭提示框
              this.dialogVisible = false
              this.$message({
                message:'上传成功'
              })
              //  清空文件
              this.clearfile()
              // 清空字段
              this.name = ''
              this.asset_type1 = 1       
      }

    },    
    // 切割文件
    sliceFile(file){
      for (var i = 0; i < file.size; i += this.chunkSize) {
        var end = i + this.chunkSize >= file.size ? file.size : i + this.chunkSize;
        let currentFile = file.slice(i, (end > file.size ? file.size : end));
        this.files.push(currentFile);
    }
    return this.files;
    },    
    // 获取文件md5值
    md5File (files) {
        const spark = new SparkMD5.ArrayBuffer();
        let fileReader;
        for (var i = 0; i < files.length; i++) {
            fileReader = new FileReader();
            fileReader.readAsArrayBuffer(files[i]);
        }
        return new Promise((resolve) => {
            fileReader.onload = function(e) {
                spark.append(e.target.result);
                if (i == files.length) {
                    resolve(spark.end());
                }
            }
        })
    }, 
    //   上传文件
    uploadfile1(files,chunkIndex,md5Val){
          if(this.upfile){
                  if(chunkIndex<files.length){
                            let form = new FormData()
                            let file = new File([files[chunkIndex]], chunkIndex, {type: this.upfile.type, lastModified: Date.now()});
                            form.append('file',file)
                            let url = `http://127.0.0.1:8085/upload?type=upload&current=${chunkIndex}&md5Val=${md5Val}&total=${files.length}&name=${this.name}&assettype=${this.asset_type}&remark=${this.remark}`
                            this.instance.post(url,form).then(res=>{
                               let chunkIndex = res.data.data.index
                               if(chunkIndex < files.length){
                                   this.uploadfile1(files,chunkIndex,this.md5)
                               }
                               else{
                                   this.merger(files,this.md5)
                               }
                            })
                  }
                }
    },
    //  合并
    merger(files,md5Val){
       this.$http.post('upload',{
          type:'merger',
          filename:this.upfile.name,
          md5Val:md5Val,
          total:files.length,
          name:this.name,
          assettype:this.asset_type,
          remark:this.remark,
      }).then(res=>{
        this.flag += 1
        this.flagpic += 1
        this.formSubmit()        
      })
    },
  },
}
</script>

<style >

.el-dialog__header{
  background:rgb(29, 28, 28);
  height: 10px;
}
.el-dialog__title{
  color: white;
  font-size: 14px;
  position: relative;  
  top:-13px
}
.el-dialog__body{
  background: black;
}
.el-dialog{
  position: relative;
  top: -55px;
}
.el-input__inner{
  border: solid 1px gray;
  background: transparent;
  color: white;
}
.hide .el-upload--picture-card{
  display: none;
}
.el-upload--picture-card{
  border: dashed 1px white;
  background: transparent;
  width: 100px;
  height: 100px;
}
.el-icon-plus{
  position: relative;
  top:-10px;
}
.is-ready{
  width: 300px;
  background: transparent;
}
.el-dialog-list__item{
  padding: 10px;
}
.el-upload-list__item-name{
  width: 250px;
}
.el-tag{
  background: gray;
  border: none;
  width: 25px;
  height: 25px;
  position: relative;
  top: 4px;
  left: 1px;
}
.el-tag .el-icon-plus{
  color:white;
  position: relative;
  top:-2px;
  left: -4px;
}
.el-dialog__close{
  position: relative;
  top:-9px;
}
.el-form-item__label{
  color: white;
}
.el-textarea__inner{
  background: transparent;
  color:white
}

</style>

