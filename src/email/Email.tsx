import type { ReactNode } from 'react'
import { Body, Button, Column, Container, Head, Heading, Hr, Html, Img, Link, Preview, Row, Tailwind, Text, pixelBasedPreset } from 'react-email'
import { designTokens, tailwindTheme } from '../tokens/index.js'
import logoSrc from '../assets/email-logo.png'
import canvasLeft from '../assets/email-canvas-left.png'
import canvasRight from '../assets/email-canvas-right.png'

const { typography } = designTokens
const fontFamily = typography.fontFamily

export interface EmailLayoutProps {
  locale: string
  title: string
  footer: string
  children: ReactNode
}

export function EmailLayout({ locale, title, footer, children }: EmailLayoutProps) {
  return (
    <Tailwind theme={tailwindTheme} config={{ presets: [pixelBasedPreset] }}>
    <Html lang={locale} className="bg-operational-surface">
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" />
        <style>{`body,table,td,p,a,h1,h2{font-family:${fontFamily}} @media only screen and (max-width:600px){.email-canvas-edge{display:none!important;width:0!important}.email-content{padding:24px 12px!important}}`}</style>
      </Head>
      <Preview>{title}</Preview>
      <Body lang={locale} className="m-0 bg-operational-surface px-3 py-8 text-center font-ui text-black">
        <Container className="mx-auto w-full max-w-[744px] bg-operational-surface text-center">
          <Row>
            <Column className="email-canvas-edge align-top" width={92}>
              <Img src={canvasLeft} alt="" width={92} height={460} role="presentation" className="block" />
            </Column>
            <Column className="email-content bg-operational-surface p-8 text-center align-top font-ui">
          <Img src={logoSrc} alt="Solaria" width={48} height={48} className="mx-auto mb-8 block" />
          <Heading as="h1" className="m-0 mb-5 text-center font-ui text-[28px] leading-9 font-semi-bold tracking-[-0.6px] text-black">{title}</Heading>
          {children}
          <Hr className="mt-8 mb-5 border-operational-border" />
          <Text className="text-center font-ui text-body leading-5 text-gray">{footer}</Text>
            </Column>
            <Column className="email-canvas-edge align-top" width={92}>
              <Img src={canvasRight} alt="" width={92} height={460} role="presentation" className="block" />
            </Column>
          </Row>
        </Container>
      </Body>
    </Html>
    </Tailwind>
  )
}

export function EmailText({ children }: { children: ReactNode }) {
  return <Text className="m-0 mb-6 text-center font-ui text-[15px] leading-[25px] text-black">{children}</Text>
}

export interface EmailActionProps { href: string; label: string; fallback: string }

export function EmailAction({ href, label, fallback }: EmailActionProps) {
  return <>
    <Button href={href} className="rounded-medium bg-orange px-7 py-4 font-ui text-body font-semi-bold text-white">{label}</Button>
    <Text className="mt-6 text-center font-ui text-body leading-5 text-gray">{fallback}</Text>
    <Link href={href} className="text-center font-ui text-body text-gray [word-break:break-all]">{href}</Link>
  </>
}
