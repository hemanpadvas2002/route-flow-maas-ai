
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				},
				// MaaS Theme Colors
				maas: {
					// Urban Dusk Gradient Colors
					'urban-dusk-1': '#1E1E2F',
					'urban-dusk-2': '#2C2C3A',
					'urban-dusk-3': '#3E3E55',
					
					// Mobility Blue Pulse Gradient Colors
					'mobility-blue-1': '#0F2027',
					'mobility-blue-2': '#203A43',
					'mobility-blue-3': '#2C5364',
					
					// AI Glow Accent Gradient and Accent
					'ai-glow-1': '#222831',
					'ai-glow-2': '#393E46',
					'ai-accent': '#00ADB5'
				},
				// Transport Mode Colors
				transport: {
					bus: '#FFA500',  // Orange
					train: '#4CAF50',  // Green
					metro: '#1E88E5',  // Blue
					taxi: '#FFEB3B',  // Yellow
					walking: '#BDBDBD',  // Light Grey
					ferry: '#0D47A1',  // Navy Blue
					cycling: '#8BC34A',  // Lime Green
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'slide-up': {
					from: {
						transform: 'translateY(100%)'
					},
					to: {
						transform: 'translateY(0)'
					}
				},
				'pulse-light': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'rotate-nfc': {
					'0%': {
						transform: 'rotate(0deg) scale(1)'
					},
					'50%': {
						transform: 'rotate(15deg) scale(1.1)'
					},
					'100%': {
						transform: 'rotate(0deg) scale(1)'
					}
				},
				'progress': {
					'0%': { width: '0%' },
					'50%': { width: '70%' },
					'100%': { width: '100%' }
				},
				'nfc-pulse': {
					'0%': {
						boxShadow: '0 0 0 0 rgba(0, 173, 181, 0.4)'
					},
					'70%': {
						boxShadow: '0 0 0 20px rgba(0, 173, 181, 0)'
					},
					'100%': {
						boxShadow: '0 0 0 0 rgba(0, 173, 181, 0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'pulse-light': 'pulse-light 2s ease-in-out infinite',
				'rotate-nfc': 'rotate-nfc 2s ease-in-out infinite',
				'progress': 'progress 2s ease-in-out infinite',
				'nfc-pulse': 'nfc-pulse 2s infinite'
			},
			backgroundImage: {
				'urban-dusk-gradient': 'linear-gradient(to bottom, #1E1E2F, #2C2C3A, #3E3E55)',
				'mobility-blue-gradient': 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)',
				'ai-glow-gradient': 'linear-gradient(to bottom, #222831, #393E46)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
