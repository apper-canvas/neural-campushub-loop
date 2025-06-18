import gradesData from '../mockData/grades.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let grades = [...gradesData];

const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === parseInt(id, 10));
    if (!grade) {
      throw new Error('Grade not found');
    }
    return { ...grade };
  },

  async getByCourse(courseId) {
    await delay(250);
    return grades.filter(g => g.courseId === parseInt(courseId, 10)).map(g => ({ ...g }));
  },

  async create(gradeData) {
    await delay(400);
    const maxId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: maxId + 1
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(350);
    const index = grades.findIndex(g => g.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Grade not found');
    }
    const updatedGrade = { ...grades[index], ...gradeData };
    grades[index] = updatedGrade;
    return { ...updatedGrade };
  },

  async delete(id) {
    await delay(250);
    const index = grades.findIndex(g => g.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Grade not found');
    }
    grades.splice(index, 1);
    return true;
  },

  async calculateGPA(courseGrades) {
    await delay(200);
    if (!courseGrades.length) return 0;
    
    const totalPoints = courseGrades.reduce((sum, course) => {
      return sum + (course.grade * course.credits);
    }, 0);
    
    const totalCredits = courseGrades.reduce((sum, course) => {
      return sum + course.credits;
    }, 0);
    
    return totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  }
};

export default gradeService;