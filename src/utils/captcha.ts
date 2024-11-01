import { createCanvas } from 'canvas'

export const generateCaptcha = () => {
  const canvas = createCanvas(120, 40)
  const ctx = canvas.getContext('2d')
  
  // Generate random code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  
  // Set background
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, 120, 40)
  
  // Add noise
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.2)`
    ctx.fillRect(Math.random() * 120, Math.random() * 40, 1, 1)
  }
  
  // Draw text
  ctx.font = 'bold 24px Arial'
  ctx.fillStyle = '#333'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Add distortion
  for (let i = 0; i < code.length; i++) {
    ctx.setTransform(
      1,
      Math.random() * 0.2 - 0.1,
      Math.random() * 0.2 - 0.1,
      1,
      20 + i * 20,
      20
    )
    ctx.fillText(code[i], 0, 0)
  }
  
  return {
    image: canvas.toBuffer(),
    code
  }
}