import { MainLayout } from "@/components/layouts/main-layout";
import { Logo, AnimatedLogo } from "@/components/logo";
import { motion } from "framer-motion";

export default function BrandingPage() {
  // Cosmic theme color palette
  const colors = [
    { name: "Cosmic Purple", hex: "#5D3FD3", hsl: "hsl(267, 75%, 53%)", cssVar: "var(--cosmic-purple)" },
    { name: "Cosmic Purple Light", hex: "#B1AFFF", hsl: "hsl(267, 75%, 75%)", cssVar: "var(--cosmic-purple-light)" },
    { name: "Cosmic Purple Dark", hex: "#4A32A8", hsl: "hsl(267, 75%, 40%)", cssVar: "var(--cosmic-purple-dark)" },
    { name: "Cosmic Blue", hex: "#2E2EFF", hsl: "hsl(240, 100%, 56%)", cssVar: "var(--cosmic-blue)" },
    { name: "Cosmic Blue Light", hex: "#6B6BFF", hsl: "hsl(240, 100%, 70%)", cssVar: "var(--cosmic-blue-light)" },
    { name: "Cosmic Accent", hex: "#FF2EC4", hsl: "hsl(330, 95%, 60%)", cssVar: "var(--cosmic-accent)" },
    { name: "Cosmic Accent Light", hex: "#FF84DE", hsl: "hsl(330, 95%, 80%)", cssVar: "var(--cosmic-accent-light)" },
    { name: "Cosmic Space", hex: "#121220", hsl: "hsl(240, 25%, 10%)", cssVar: "var(--cosmic-space)" },
    { name: "Cosmic Space Light", hex: "#1E1E2D", hsl: "hsl(240, 25%, 18%)", cssVar: "var(--cosmic-space-light)" },
    { name: "Cosmic Space Lighter", hex: "#252538", hsl: "hsl(240, 25%, 22%)", cssVar: "var(--cosmic-space-lighter)" },
  ];

  // Logo SVG definition
  const logoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#5D3FD3" />
          <stop offset="100%" stop-color="#2E2EFF" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="20" fill="url(#logoGradient)" />
      <text x="50" y="65" font-family="Arial, sans-serif" font-size="50" font-weight="bold" text-anchor="middle" fill="white">E</text>
    </svg>
  `;

  // Horizontal logo SVG
  const horizontalLogoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#5D3FD3" />
          <stop offset="100%" stop-color="#2E2EFF" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="16" fill="url(#logoGradient)" />
      <text x="40" y="55" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">E</text>
      <text x="160" y="48" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">Echoverse</text>
    </svg>
  `;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="mb-12 text-center">
          <motion.h1 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Echoverse Branding
          </motion.h1>
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our brand represents connection, intelligence, and a cosmic vision of the future.
            Here you'll find our logo, colors, typography, and design elements.
          </motion.p>
        </div>

        {/* Logo Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-800">Logo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">Icon</h3>
              <div className="h-32 w-32 mb-4">
                <div className="h-full w-full rounded-lg cosmic-gradient flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-5xl">E</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">App icon, favicon, and square format</p>
                <div className="flex justify-center gap-4">
                  <div dangerouslySetInnerHTML={{ __html: logoSvg }} />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold mb-4">Horizontal Logo</h3>
              <div className="mb-8">
                <Logo variant="full" className="scale-150 mb-4" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">Full brand logo for website headers and marketing materials</p>
                <div className="flex justify-center">
                  <div dangerouslySetInnerHTML={{ __html: horizontalLogoSvg }} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-8 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Animated Logo</h3>
            <div className="flex justify-center">
              <AnimatedLogo />
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              The animated version of our logo represents the dynamic AI ecosystem of Echoverse,
              with orbiting elements symbolizing different AI capabilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-4">Dark Mode</h3>
              <div className="bg-gray-950 rounded-lg p-8 flex justify-center">
                <Logo variant="full" />
              </div>
            </div>
            <div className="bg-gray-200 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Light Mode</h3>
              <div className="bg-white rounded-lg p-8 flex justify-center">
                <div className="h-10 w-10 rounded-lg cosmic-gradient flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="text-gray-900 font-bold text-xl ml-2">Echoverse</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Color Palette */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-800">Color Palette</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {colors.map((color, index) => (
              <div key={index} className="bg-gray-900 rounded-xl overflow-hidden">
                <div 
                  className="h-24" 
                  style={{ backgroundColor: color.hex }}
                ></div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{color.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">HEX: {color.hex}</p>
                    <p className="text-gray-400">HSL: {color.hsl}</p>
                    <p className="text-gray-400">CSS: {color.cssVar}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-4">Gradients</h3>
              <div className="space-y-4">
                <div className="h-16 rounded-lg cosmic-gradient mb-2"></div>
                <p className="text-sm text-gray-400">Primary Gradient: Cosmic Purple to Cosmic Blue</p>
                
                <div className="h-16 rounded-lg bg-gradient-to-r from-accent to-primary-light mb-2"></div>
                <p className="text-sm text-gray-400">Accent Gradient: Cosmic Accent to Cosmic Purple Light</p>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-4">Text Effects</h3>
              <div className="space-y-4">
                <div className="mb-4">
                  <h4 className="text-lg text-white mb-2">Cosmic Text</h4>
                  <p className="text-3xl font-bold cosmic-text">Echoverse</p>
                  <p className="text-sm text-gray-400 mt-2">
                    CSS: background: linear-gradient(90deg, hsl(var(--cosmic-accent)), hsl(var(--cosmic-purple-light)));
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                  </p>
                </div>
                <div>
                  <h4 className="text-lg text-white mb-2">Glow Effects</h4>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg cosmic-gradient flex items-center justify-center shadow-glow">
                      <span className="text-white font-bold">E</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      shadow-glow: box-shadow: 0 0 15px rgba(var(--cosmic-purple-light), 0.5);
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Typography */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-800">Typography</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-4">Primary Font - Inter</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Light 300</p>
                  <p className="font-light text-2xl">Echoverse Platform</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Regular 400</p>
                  <p className="font-normal text-2xl">Echoverse Platform</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Medium 500</p>
                  <p className="font-medium text-2xl">Echoverse Platform</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Semibold 600</p>
                  <p className="font-semibold text-2xl">Echoverse Platform</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Bold 700</p>
                  <p className="font-bold text-2xl">Echoverse Platform</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Extra Bold 800</p>
                  <p className="font-extrabold text-2xl">Echoverse Platform</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-4">Monospace - JetBrains Mono</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Regular 400</p>
                  <p className="font-mono text-xl">Echoverse Platform</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Medium 500</p>
                  <p className="font-mono font-medium text-xl">Echoverse Platform</p>
                </div>
                <div className="mt-8">
                  <h4 className="text-lg mb-2">Code Example</h4>
                  <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm">
                    <p><span className="text-blue-400">function</span> <span className="text-green-400">echoAI</span>(<span className="text-yellow-400">prompt</span>) &#123;</p>
                    <p className="ml-4"><span className="text-purple-400">return</span> <span className="text-blue-400">new</span> <span className="text-green-400">Promise</span>(<span className="text-yellow-400">response</span> =&gt; &#123;</p>
                    <p className="ml-8"><span className="text-red-400">// AI magic happens here</span></p>
                    <p className="ml-4">&#125;);</p>
                    <p>&#125;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Design Elements */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-800">Design Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-4">Card Styles</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-6 border border-primary/10 glow-border">
                  <h4 className="font-medium mb-2">Standard Card</h4>
                  <p className="text-sm text-gray-400">Base card with subtle glow border effect</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 border border-primary/10 glow-border card-hover">
                  <h4 className="font-medium mb-2">Hover Card</h4>
                  <p className="text-sm text-gray-400">Card with hover animation effects</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-4">Backgrounds</h3>
              <div className="space-y-4">
                <div className="h-32 rounded-lg bg-gray-900 relative overflow-hidden mb-2">
                  <div className="absolute top-0 left-0 w-full h-full grid-bg"></div>
                </div>
                <p className="text-sm text-gray-400">Grid Background</p>
                
                <div className="h-32 rounded-lg bg-gray-900 relative overflow-hidden mb-2">
                  <div className="absolute top-0 left-0 w-20 h-20 bg-primary/20 rounded-full filter blur-[30px]"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/20 rounded-full filter blur-[40px]"></div>
                </div>
                <p className="text-sm text-gray-400">Gradient Blob Background</p>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-4">Buttons</h3>
              <div className="space-y-4">
                <div>
                  <button className="px-6 py-3 font-medium bg-primary hover:bg-primary/90 text-white rounded-lg shadow-glow transition-all transform hover:scale-105 w-full mb-2">
                    Primary Button
                  </button>
                  <p className="text-sm text-gray-400">Primary action with glow and scale effect</p>
                </div>
                
                <div>
                  <button className="px-6 py-3 font-medium border border-primary/30 text-white rounded-lg hover:bg-primary/10 transition-colors w-full mb-2">
                    Secondary Button
                  </button>
                  <p className="text-sm text-gray-400">Secondary action with subtle hover effect</p>
                </div>
                
                <div>
                  <button className="inline-flex items-center px-4 py-2 bg-gray-800 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
                    <span>Icon Button</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <p className="text-sm text-gray-400 mt-2">Button with icon</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
}
