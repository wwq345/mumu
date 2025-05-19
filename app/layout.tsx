import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DesignFlow应用',
  description: '使用Coze API创建精美设计',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
