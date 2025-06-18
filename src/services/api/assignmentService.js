import assignmentsData from '../mockData/assignments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let assignments = [...assignmentsData];

const assignmentService = {
  async getAll() {
    await delay(250);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(id, 10));
    if (!assignment) {
      throw new Error('Assignment not found');
    }
    return { ...assignment };
  },

  async getByCourse(courseId) {
    await delay(300);
    return assignments.filter(a => a.courseId === parseInt(courseId, 10)).map(a => ({ ...a }));
  },

  async create(assignmentData) {
    await delay(400);
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1,
      completed: false
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(300);
    const index = assignments.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    const updatedAssignment = { ...assignments[index], ...assignmentData };
    assignments[index] = updatedAssignment;
    return { ...updatedAssignment };
  },

  async delete(id) {
    await delay(250);
    const index = assignments.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    assignments.splice(index, 1);
    return true;
  },

  async markComplete(id) {
    await delay(200);
    const index = assignments.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    assignments[index].completed = true;
    return { ...assignments[index] };
  },

  async markIncomplete(id) {
    await delay(200);
    const index = assignments.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    assignments[index].completed = false;
    return { ...assignments[index] };
  }
};

export default assignmentService;