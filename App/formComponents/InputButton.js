import React from 'react'
import { Button } from 'react-native-elements'
import { Image } from 'react-native';
import arrowForward from '../assets/icons/right-arrow-white.png'
const InputButton = ({ title, buttonType, buttonColor, ...rest }) =>{
 return (
    
    <Button
        {...rest}
        type={buttonType}
        title={title}
        buttonStyle={{ borderColor: buttonColor, backgroundColor: buttonColor, borderRadius: 30, width: '40%', alignSelf: 'flex-end', height: 56 }}
        titleStyle={{ color: '#ffffff', fontSize: 18 }}
        icon={<Image source={arrowForward} style={{width: 20, height: 20, marginLeft: 10 }}/>}
        iconRight={true}
    />
)
}
export default InputButton