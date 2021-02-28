import {configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

const mockConsoleMethod = (realConsoleMethod) => {
    const ignoredMessages = [
      'inside a test was not wrapped in act(...)',
    ]
    return (message, ...args) => {
      const containsIgnoredMessage = ignoredMessages.some(ignoredMessage => message.includes(ignoredMessage));
  
      if (!containsIgnoredMessage) {
        realConsoleMethod(message, ...args);
      }
    }
};
  
console.error = jest.fn(mockConsoleMethod(console.error));
jest.setTimeout(1000 * 60 * 10);
configure({adapter: new Adapter()});