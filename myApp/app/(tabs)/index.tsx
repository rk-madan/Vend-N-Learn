import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  return (
    <WebView source={{ uri: 'http://192.168.61.254:5173' }} />

  );
}
