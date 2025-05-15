import { isDev } from "./helpers";

export const pricingPlans = [
    {
        name: 'Basic',
        price: 9,
        description: 'Perfect for light users.',
        items: [
            "5 PDF summaries per month",
            "Standard processing",
            "Email support",
        ],
        id: 'basic',
        paymentLink: isDev ? 
        'https://buy.stripe.com/test_fZe7vD64xbgk55m3cc' : 
        '',
        priceId: isDev ?
        'price_1RLvuvRv6EQYBUB5LOmiQtIE' : 
        '',
    },
    {
        name: 'Pro',
        price: 19,
        description: 'Ideal for power users.',
        items: [
            "Unlimited PDF summaries per month",
            "Priority processing",
            "24/7 priority support",
            "Markdown Export",
        ],
        id: 'pro',
        paymentLink: isDev ?
        'https://buy.stripe.com/test_9AQdU178Bdos69q8wx' : 
        '',
        priceId: isDev ?
        'price_1RLvuvRv6EQYBUB5BzT8UiAG' : 
        '',
    },
];

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.5,
        },
    }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 50,
      duration: 0.8,
    },
  },
};