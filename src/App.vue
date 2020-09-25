<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss" >
/* 引入全局的字体图标 */
@import "./styles/iconfont.wxss";

page,view,navigator,text,swiper,swiper-item,input,image{
	box-sizing: border-box;

}
page{
	font-size: 28rpx;
	color:#666;
}
image{
	width: 100%; 
	/* display: block; */
	/* 去除掉 默认的3px间隙 */
}

</style>
