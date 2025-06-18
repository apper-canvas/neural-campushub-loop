import scheduleData from '../mockData/schedules.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let schedules = [...scheduleData];

const scheduleService = {
  async getAll() {
    await delay(300);
    return [...schedules];
  },

  async getById(id) {
    await delay(200);
    const schedule = schedules.find(s => s.Id === parseInt(id, 10));
    if (!schedule) {
      throw new Error('Schedule not found');
    }
    return { ...schedule };
  },

  async getByCourse(courseId) {
    await delay(250);
    return schedules.filter(s => s.courseId === parseInt(courseId, 10)).map(s => ({ ...s }));
  },

  async getByDay(dayOfWeek) {
    await delay(200);
    return schedules.filter(s => s.dayOfWeek === dayOfWeek).map(s => ({ ...s }));
  },

  async create(scheduleData) {
    await delay(400);
    const maxId = Math.max(...schedules.map(s => s.Id), 0);
    const newSchedule = {
      ...scheduleData,
      Id: maxId + 1
    };
    schedules.push(newSchedule);
    return { ...newSchedule };
  },

  async update(id, scheduleData) {
    await delay(350);
    const index = schedules.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Schedule not found');
    }
    const updatedSchedule = { ...schedules[index], ...scheduleData };
    schedules[index] = updatedSchedule;
    return { ...updatedSchedule };
  },

  async delete(id) {
    await delay(250);
    const index = schedules.findIndex(s => s.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Schedule not found');
    }
    schedules.splice(index, 1);
    return true;
  }
};

export default scheduleService;