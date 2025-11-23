export const environment = {
  production: true,
  recaptcha: {
    siteKey: '6Ldkj0srAAAAAH8QhpzHEsARXjqfbnR3mIOyBsOQ'
  },
  mail: {
    provider: 'formspree', // 'formspree' | 'emailjs' | 'web3forms' | 'mock'
    formspree: {
      endpoint: 'https://formspree.io/f/mnndejao'
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
