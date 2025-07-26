import { isDev } from "./helpers";

export const pricingPlans = [
    {
        name: 'basic',
        price: 9,
        description: 'will add description later',
        items: [
            '5 PDF summaries per month',
            'Standard processing speed',
            'Email support'
        ],
        id: 'basic',
        paymentLink: isDev 
        ? 'https://buy.stripe.com/test_8x29AS4T74Q85Bq1ZS2cg00' 
        : 'https://buy.stripe.com/test_8x29AS4T74Q85Bq1ZS2cg00' ,
        priceId: isDev 
        ? 'price_1RWjlsAWAeIKt8RPJmgu8Wuf' 
        : 'price_1RWjlsAWAeIKt8RPJmgu8Wuf' ,
    },
    {
        name: 'Pro',
        price: 19,
        description: 'For professional and teams',
        items: [
            'Unlimited PDF summaries',
            'Priority processing',
            '24/7 priority support',
            'Markdown Export',
        ],
        id: 'pro',
        paymentLink: isDev 
        ? 'https://buy.stripe.com/test_9B600i3P30zS0h6cEw2cg01' 
        : 'https://buy.stripe.com/test_9B600i3P30zS0h6cEw2cg01' ,
        priceId: isDev 
        ? 'price_1RWjuwAWAeIKt8RPsLdZa621' 
        : 'price_1RWjuwAWAeIKt8RPsLdZa621' 
        ,
    }
]

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChilder: 0.2,
            delayChilden: 0.1,
        },
    },
}

export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        transition: {
            transition: {
                type: 'spring',
                damping: 15,
                stiffness: 50,
                duration: 0.8,
            }
        }
    }
}