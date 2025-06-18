import coursesData from '../mockData/courses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let courses = [...coursesData];

const courseService = {
  async getAll() {
    await delay(300);
    return [...courses];
  },

  async getById(id) {
    await delay(200);
    const course = courses.find(c => c.Id === parseInt(id, 10));
    if (!course) {
      throw new Error('Course not found');
    }
    return { ...course };
  },

  async create(courseData) {
    await delay(400);
    const maxId = Math.max(...courses.map(c => c.Id), 0);
    const newCourse = {
      ...courseData,
      Id: maxId + 1
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await delay(350);
    const index = courses.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Course not found');
    }
    const updatedCourse = { ...courses[index], ...courseData };
    courses[index] = updatedCourse;
    return { ...updatedCourse };
  },

  async delete(id) {
    await delay(250);
    const index = courses.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Course not found');
    }
    courses.splice(index, 1);
    return true;
  },

  async enroll(courseId) {
    await delay(300);
    const course = courses.find(c => c.Id === parseInt(courseId, 10));
    if (!course) {
      throw new Error('Course not found');
    }
    course.enrolled = true;
    return { ...course };
  },

  async drop(courseId) {
    await delay(300);
    const course = courses.find(c => c.Id === parseInt(courseId, 10));
    if (!course) {
      throw new Error('Course not found');
    }
    course.enrolled = false;
    return { ...course };
  }
};

export default courseService;