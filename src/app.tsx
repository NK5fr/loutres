import { createRoot } from 'react-dom/client';
import { BrowserRouter} from 'react-router';
import Navigator from './Navigator';
import Header from './Header';

const root = createRoot(document.querySelector('#root')!);
root.render(
    <BrowserRouter>
      <Header></Header>
      <Navigator></Navigator>
    </BrowserRouter>
);
