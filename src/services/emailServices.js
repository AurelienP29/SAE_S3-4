
import emailjs from '@emailjs/browser';

export default {
    methods: {
        sendEmail() {
            emailjs
                .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this.$refs.form, {
                    publicKey: 'YOUR_PUBLIC_KEY',
                })
                .then(
                    () => {
                        console.log('SUCCESS!');
                    },
                    (error) => {
                        console.log('FAILED...', error.text);
                    },
                );
        },
    },
};
