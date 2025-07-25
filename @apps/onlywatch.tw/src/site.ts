export const site = {
  name: 'onlywatch.tw',
  getTitle(pageTitle: string) {
    return `${pageTitle} | ${this.name}`
  },
}
