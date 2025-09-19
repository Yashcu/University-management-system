import { createCrudService } from './api';

const baseService = createCrudService('branch');

export const branchService = {
  ...baseService,
  add: (data) => baseService.add(data, ''),
};
