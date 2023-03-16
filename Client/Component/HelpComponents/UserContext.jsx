import { Alert, View, Text } from 'react-native'
import React, { useContext, useState, useEffect, createContext } from 'react'
import emailjs from '@emailjs/browser';

const UserContext = createContext()
const UserUpdateContext = createContext()
export function useUserContext() {
    return useContext(UserContext)
}
export function useUserUpdateContext() {
    return useContext(UserUpdateContext)
}

function SendEmail(senderEmail, userName){
    useEffect(() => {
        console.log('start User Context ');
        handleSendCode = () => {
            if (senderEmail) {
                generateCode();
            } else {
                Alert.alert('Error!', 'Please enter your email address.');
            }
        };
    }, [])

    const generateCode = () => {
        let codeTemp = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 5; i++) {
            codeTemp += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        // Set the template parameters for the email
        const templateParams = {
            senderEmail: senderEmail,
            userName: userName,
            code: codeTemp,
        };

        // Send the email using EmailJS
        emailjs.send('service_cg2lqzg', 'template_pqsos33', templateParams, 'amgCa1UEu2kFg8DfI')
            .then(result => {
                console.log(result);
                Alert.alert('Code sent!', 'Check your email for the verification code.');
            })
            .catch(error => {
                console.log(error);
                Alert.alert('Error!', 'An error occurred while sending the verification code.');
            });
    };
};



// Noam API 

