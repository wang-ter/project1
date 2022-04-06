<template>
  <div>
    <div>
        <h1>表单测试页面</h1>
       <form action="http://127.0.0.1:8085/process_get" method="GET">
        <div class="input">First Name:<input type="text" name="first_name"></div>  
        <br><br>
        <div class="input">Last Name: <input type="text" name="last_name"></div>  
        <br><br>
        <div class="input"><input type="submit" value="Submit"></div>
    </form>
    </div>
  </div>
</template>

<script>
export default {
    name:'formdata',
    data(){
        return{

        }
    },
    methods:{

    },
}
</script>

<style scoped>
.input{
  height: 20px;
  width: 150px;
}
</style>