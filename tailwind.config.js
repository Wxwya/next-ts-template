// app/tailwind.config.js

/** 
 * @type {import('tailwindcss').Config} 
 */
const { addIconSelectors } = require('@iconify/tailwind');

module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			animation: {
				dropAndZoomOnce: 'dropAndZoom 0.8s ease-in-out forwards',
				glitch: 'glitch 1s linear infinite',
				glitchTop: 'glitchTop 1s linear infinite',
				glitchBotom: 'glitchBotom 1.5s linear infinite',
				'shiny-text': 'shiny-text 8s infinite'
			},
			keyframes: {
				dropAndZoom: {
					'0%': {
						transform: 'translateY(-600px) scale(0.5)',
						opacity: '0'
					},
					'50%': {
						transform: 'translateY(0px) scale(1.2)',
						opacity: '0.7'
					},
					'100%': {
						transform: 'translateY(0) scale(1)',
						opacity: '1'
					}
				},
				glitch: {
					'2%,64%': {
						transform: 'translate(2px,0) skew(0deg)'
					},
					'4%,60%':{
						transform: 'translate(-2px,0) skew(0deg)'
					},
					'62%':{
						transform: 'translate(0,0) skew(5deg)' 
					}
				},
				glitchTop: {
					'2%,64%':{
						transform: 'translate(2px,-2px)'
					},
					'4%,60%':{
						transform: 'translate(-2px,2px)'
					},
					'62%':{
						transform: 'translate(13px,-1px) skew(-13deg)' 
					}
				},
				glitchBotom: {
					'2%,64%':{
						transform: 'translate(-2px,0)'
					},
					'4%,60%':{
						transform: 'translate(-2px,0)'
					},
					'62%':{
						transform: 'translate(-22px,5px) skew(21deg)' 
					}
				},
  			'shiny-text': {
  				'0%, 90%, 100%': {
  					'background-position': 'calc(-100% - var(--shiny-width)) 0'
  				},
  				'30%, 60%': {
  					'background-position': 'calc(100% + var(--shiny-width)) 0'
  				}
  			}
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),addIconSelectors(["solar"]), 
	],
};
