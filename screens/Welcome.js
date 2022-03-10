import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { 
    InnerContainer, 
    PageTitle, 
    SubTitle, 
    StyledFormArea, 
    StyledButton, 
    ButtonText, 
    Line,
    WelcomeContainer,
    WelcomeImage,
    Avatar
} from './../components/styles';

const Welcome = () => {

    return (
        <>
            <StatusBar style="light" />
            <InnerContainer>
                <WelcomeImage resizeMode="cover" source={require('./../assets/img/background.jpg')} />
                <WelcomeContainer>
                <PageTitle welcome={true}>Welcome buddy!</PageTitle>
                <SubTitle welcome={true}>Elon Musk</SubTitle>
                <SubTitle welcome={true}>elonmusk@gmail.com</SubTitle>
                    <StyledFormArea>
                    <Avatar resizeMode="cover" source={require('./../assets/img/c8.jpg')} />
                        <Line />
                        <StyledButton onPress={() => {}}>
                            <ButtonText>Logout</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
};

export default Welcome;