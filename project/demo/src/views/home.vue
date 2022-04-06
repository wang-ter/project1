<template>
<div>
    <div style="height:80px;background:pink">Header</div>
    <div class="content">
        <div class="left">
            <el-menu router>
                <el-submenu index = '1'>
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>导航一</span>
                    </template> 
                        <el-menu-item index="timeshow">1、計時器</el-menu-item>
                        <el-menu-item index="formdata">2、表单提交</el-menu-item>
                        <el-menu-item index="uploadfile">3、文件上传</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div class="right">
            <router-view></router-view>
        </div>
    </div>
</div>
                               
         
   
</template>

<script>
export default {
    name:'home',
    data(){
        return{
        menus:[{
            rname:'timeshow',
            name:'计时器'
        },{
            rname:'formdata',
            name:'表单提交'
        }]
        }
    }
}
</script>

<style>
*{
    margin: 0;
    padding:0 ;
    /* width: 100%;
    height: 100%; */
    /* overflow: hidden; */
}
.content{
    overflow: auto;
}
.left{
    float: left;
    width: 200px;
    height: 613px;
    background: gray;
    overflow: hidden;
}
.right{
    height: 613px;
    background: yellowgreen;
    margin-left: 200px;
}
/* .el-header{
    background: grey;
    height: 80px !important;
}
.el-aside{
    height: 613.82px; 
    border: solid 1px black;
    /* width: 200px; */
    /* overflow: hidden;
} */ 
/* .el-menu{
    width: 200px;
    /* height: 50px; */
    /* background: pink; */
    /* border: solid 5px red; */
/* }  */
/* .el-submenu__icon-arrow ::before{ */
    /* border: solid 1px red; */
    /* position: relative;
    top: -10px;
    height: 40px;
    left: -70px; */
/* } */
/* .el-main{
    border: 1px solid black;
    /* height: 613px; */
    /* overflow: auto; */
/* }  */
/* .el-icon-location{
   height: 20px;
}
.el-menu-item-group__title{
    height: 20px;
} */

</style>