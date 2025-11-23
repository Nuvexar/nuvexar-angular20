export const environment = {
  production: false,
  recaptcha: {
    siteKey: '6LezzEUrAAAAAECIVvdWp6T2gZG8WLg8WOB9Rrl-'
  },
  mail: {
    provider: 'mock', // 'formspree' | 'emailjs' | 'web3forms' | 'mock'
    formspree: {
      endpoint: 'https://formspree.io/f/mrbqvydd'
    },
    web3forms: {
      endpoint: 'https://api.web3forms.com/submit',
      accessKey: 'REPLACE_WITH_ACCESS_KEY'
    },
    emailjs: {
      serviceId: '',
      templateId: '',
      publicKey: ''
    }
  }
};
