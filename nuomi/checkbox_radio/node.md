###自定义checkbox和radio
具体思路是使用label的for属性，能控制对应id的input，此时就是控制checkbox和radio的checked属性,来改变label的样式
1. 利用background-position,直接将图片设置为label的background-image
    background-position的偏移量是图片中心向左和下移动的量
    但是不能在同一个label中写字。
2. 利用::after和::before伪元素，我还是使用background-image的做法，结果调整了半天，而且和方法一相似。
    看了别人的笔记后发现，应该用符号而不是图片
    用css画出选中和未选中的图

调整偏移量好麻烦,重点找错
