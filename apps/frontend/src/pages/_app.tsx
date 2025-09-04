import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';

// Define custom colors if needed
const myColor: MantineColorsTuple = [
  '#e7f5ff',
  '#d0ebff',
  '#a5d8ff',
  '#74c0fc',
  '#339af0',
  '#228be6',
  '#1c7ed6',
  '#1971c2',
  '#1864ab',
  '#145591'
];

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: 'blue',
  defaultRadius: 'md',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Component {...pageProps} />
    </MantineProvider>
  );
}