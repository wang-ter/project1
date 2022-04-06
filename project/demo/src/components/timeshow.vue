<template>
   <div>
        <h1>展示时间的页面</h1>
        <br>
        <h1>当前时间是：{{time2}}</h1>
        <br>
        <div @click="getnowtime">
        <el-switch
        v-model="switchflag"
        active-text="实时时间">
        </el-switch>
        </div>
        <br>
        <input type="range" id="points" name="points" min="0" max="86399" v-model='num_value' @click="getValue()" style="width:300px">
        <br>
        <p style="color:red;font-size:14px">注：移动滑动条可以重新定位</p>
        
   </div>
</template>
<script>

export default {
    name:'timeshow',
    data(){
        return{
            num_value:'0',
            data:'000',
            time:'',
            timer:'',
            timers:'',
            time1:'',
            time2:'',
            time3:'',
            switchflag:false,
 
        }
    },
    mounted(){
        // this.startTime()
        this.timer = setInterval(this.getdate,1000) 
    },
    created(){
        
    },
    destroyed(){
        clearInterval(this.timer)
        // clearInterval(this.timer2)
    },
    methods:{
        getValue(){
            // 1、获取滚动条中的时间
            var s = this.num_value
            // 2、处理滚动条中的时间为 h：m：s的格式
            if(s > -1){
                var hour = Math.floor(s/3600);
                var min = Math.floor(s/60) % 60;
                var sec = s % 60;   
                if(hour < 10) {
                    this.time2 = '0'+ hour + ":";
                } else {
                    this.time2 = hour + ":";
                }    
                if(min < 10){this.time2 += "0";}
                this.time2 += min + ":";
                if(sec < 10){this.time2 += "0";}
                this.time2 += sec;
            }
            clearInterval(this.timer)
            clearInterval(this.timer2)
            //  时间计时器
            this.timer2 = setInterval(this.getValue2,1000)     
        },
        getValue2(){
            var time_arr = this.time2.split(':')
            for(var i=0;i<time_arr.length;i++){
                var  h1 = Number(time_arr[0])
                var m1 = Number(time_arr[1])
                var s1 = Number(time_arr[2])
            }           
            if(s1 >= 59){
                  s1 = 0 
                  if(m1 >= 59){
                    m1 = 0 
                    h1 += 1               
                  }else{
                      m1 += 1
                  }
            }else{
                s1 += 1
            } 
            if(h1>=24){
                h1 = 0
            } 
            h1 = this.check(h1.toString())  
            m1 = this.check(m1.toString())
            s1 = this.check(s1.toString())   
            this.time2 = h1 + ":" + m1 + ":" + s1
            // 3、重新定位时间反应到滚动条
            var hour = this.time2.split(':')[0];
            var min = this.time2.split(':')[1];
            var sec = this.time2.split(':')[2];
            this.num_value = Number(hour*3600) + Number(min*60) + Number(sec);
        },
        getdate(){
            //  1、获取同步时间 h:m:s
            var date = new Date()
            var h = date.getHours()
            var m = date.getMinutes()
            var s = date.getSeconds()
            h = this.check(h)
            m = this.check(m)
            s = this.check(s)
            this.time1 = h + ":" + m + ":" + s;
            this.time2 = this.time1
            //  1、同步时间反应到滚动条中
            var hour = this.time1.split(':')[0];
            var min = this.time1.split(':')[1];
            var sec = this.time1.split(':')[2];
            this.num_value = Number(hour*3600) + Number(min*60) + Number(sec);                   
        },
        check(i){
	        if (i<10){
		    i="0" + i;
	        }
	        return i;
        },
        // 切换按钮自动跳转实时时间
        getnowtime(){
            if(this.switchflag){
                document.getElementById('points').disabled = true
                this.getdate()
            }else{
                document.getElementById('points').disabled = false
                clearInterval(this.timer)
            }
        },

    },

}
</script>

<style scoped>

</style>
 