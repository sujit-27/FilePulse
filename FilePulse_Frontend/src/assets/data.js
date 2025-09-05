import { UploadCloud, Lock, Share2, CreditCard, Folder, Activity, Upload, icons, LayoutDashboard, UploadCloudIcon, Files, CreditCardIcon, Receipt } from 'lucide-react';
import testimonial1 from "../assets/testimonials/testimonial1.jpg"
import testimonial2 from "../assets/testimonials/testimonial2.jpeg"
import testimonial3 from "../assets/testimonials/testimonial3.jpg"

export const features = [
    {
        icon: UploadCloud,
        title:"Easy File Upload",
        description:"Quickly upload your files with our intuitive drag-and-drop interface."
    },
    {
        icon: Lock,
        title:"Secure Storage",
        description:"Your files are encrypted and stored securely in our cloud infrastructure."
    },
    {
        icon:Share2,
        title:"Simple Sharing",
        description:"Shares files with anyone using secure links that you control."
    },
    {
        icon:CreditCard,
        title:"Flexible Credits",
        description:"Pay only for what you use with our credit-based system."
    },
    {
        icon:Folder,
        title:"File Management",
        description:"Organize, preview, and manage your files from any device."
    },
    {
        icon:Activity,
        title:"Transaction History",
        description:"Keep track of all your credit purchases and usage."
    },

]

export const pricingPlans = [
    {
        name:"Free",
        description: "Ideal for beginners to explore and get started with essential features.",
        price:"0",
        features:[
            {
                featureIndex:1,
                feature:"10 file uploads",
            },
            {
                featureIndex:2,
                feature:"Basic file sharing",
            },
            {
                featureIndex:3,
                feature:"7-day file retention",
            },
            {
                featureIndex:4,
                feature:"Email support",
            },
        ],
        cta:"Get Started",
    },
    {
        name:"Premium",
        description:"Designed for individuals who need enhanced capabilities and priority support.",
        price:"499",
        highlighted:true,
        features:[
            {
                featureIndex:1,
                feature:"500 file uploads",
            },
            {
                featureIndex:2,
                feature:"Advanced file sharing",
            },
            {
                featureIndex:3,
                feature:"30-day file retention",
            },
            {
                featureIndex:4,
                feature:"Priority email support",
            },
            {
                featureIndex:5,
                feature:"File analytics",
            },
        ],
        cta:"Go Premium",

    },
    {
        name:"Ultimate",
        description:"Comprehensive solution tailored for teams and businesses requiring full access and collaboration.",
        price:"2499",
        features:[
            {
                featureIndex:1,
                feature:"5000 file uploads",
            },
            {
                featureIndex:2,
                feature:"Team sharing capabilities",
            },
            {
                featureIndex:3,
                feature:"Unlimited file retention",
            },
            {
                featureIndex:4,
                feature:"24/7 priority support",
            },
            {
                featureIndex:5,
                feature:"Advanced analytics",
            },
            {
                featureIndex:6,
                feature:"API access",
            },
        ],
        cta:"Go Ultimate",
    },
]

export const testimonials = [
    {
        image:testimonial1,
        name:"Michael Chen",
        role:"Marketing Director",
        company:"CreativeMinds Inc.",
        rating:4,
        quote:"FilePluse has transformed how our team collaborates an creative assets. The secure sharing and intuitive interface have made file management a breeze."
    },
    {
        image:testimonial2,
        name:"Alonso Johnson",
        role:"Freelance Designer",
        company:"Self-employed",
        rating:4.5,
        quote:"As a freelancer, I need to share large design files with clients securely. FilePulse's simple interface and reasonable pricing make it my go-to solution.",
    },
    {
        image:testimonial3,
        name:"Sarah Johnson",
        role:"Project Manager",
        company:"TechSolutions Ltd.",
        rating:4,
        quote:"Managing project files accross multiple teams used to be a nightmare untill we found FilePulse. Now everything is organized and accessible exactly when we need it.",
    },
]

export const SIDE_MENU_DATA = [
    {
        id: 1,
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        id: 2,
        label: "Upload",
        icon: UploadCloudIcon,
        path: "/upload",
    },
    {
        id: 3,
        label: "My Files",
        icon: Files,
        path: "/my-files",
    },
    {
        id: 4,
        label: "Subscription",
        icon: CreditCardIcon,
        path: "/subscriptions",
    },
    {
        id: 5,
        label: "Transactions",
        icon: Receipt,
        path: "/transactions",
    },
]