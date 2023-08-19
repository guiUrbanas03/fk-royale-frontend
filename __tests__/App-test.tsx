/**
 * @format
 */

import 'react-native';
import React from 'react';
import {Root} from '../src/Root';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {it} from 'node:test';

it('renders correctly', () => {
  renderer.create(<Root />);
});
