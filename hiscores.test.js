const hiscores = require('./hiscores');

test('Get Lynx Titans stats', async done => {
  const callback = data => {
    expect(data.main.stats.overall.level).toBe('2277');
    expect(data.main.stats.overall.rank).toBe('1');
    expect(data.main.stats.overall.xp).toBe('4600000000');
    done();
  };

  hiscores.getStats('Lynx Titan', 'main').then(callback);
});

test('Ensure correct lengths', async done => {
  const callback = data => {
    expect(Object.keys(data.main.stats).length).toBe(24);
    expect(Object.keys(data.main.clues).length).toBe(7);
    expect(Object.keys(data.main.bh).length).toBe(2);
    expect(Object.keys(data.main.lms).length).toBe(2);
    done();
  };

  hiscores.getStats('B0aty', 'main').then(callback);
});
