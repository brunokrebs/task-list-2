import { TaskListPage } from './app.po';

describe('task-list App', () => {
  let page: TaskListPage;

  beforeEach(() => {
    page = new TaskListPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
