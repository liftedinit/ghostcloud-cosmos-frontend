import "../styles/globals.css"
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { defaultTheme } from "../config"
import "@interchain-ui/react/styles"
import Header from "../components/header"
import Footer from "../components/footer"
import { QueryClient, QueryClientProvider } from "react-query"

const queryClient = new QueryClient()

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={defaultTheme}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default CreateCosmosApp
