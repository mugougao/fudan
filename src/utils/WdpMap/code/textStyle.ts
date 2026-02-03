const textStyle = {
  roamingRoute: {
    text: "3D文字",
    color: "DCAD7Eff", // HEXA或rgba(0,0,0,0.8)
    type: "plain", // 样式(plain; reflection; metal)
    outline: 0.4, // 轮廓(单位:百分比), 取值范围[0~1]
    portrait: false, // 纵向(true/false)
    space: 0.2, // 间距(单位:米)
    bounce: 0, // 反射值
    faceToCamera: false, // 是否始终面向镜头(true/false)
  },
  room: {
    text: "3D文字",
    color: "CC1A1A", // HEXA或rgba(0,0,0,0.8)
    type: "plain", // 样式(plain; reflection; metal)
    outline: 0.4, // 轮廓(单位:百分比), 取值范围[0~1]
    portrait: false, // 纵向(true/false)
    space: 0.2, // 间距(单位:米)
    bounce: 0, // 反射值
    faceToCamera: false, // 是否始终面向镜头(true/false)
  },
};

export type ITextStyle = keyof typeof textStyle;

export default textStyle;
