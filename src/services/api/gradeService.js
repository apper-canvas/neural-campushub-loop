import { toast } from 'react-toastify';

const gradeService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "course_id" } },
          { field: { Name: "assignment_type" } },
          { field: { Name: "weight" } },
          { field: { Name: "score" } },
          { field: { Name: "total" } },
          { field: { Name: "percentage" } }
        ],
        orderBy: [
          { fieldName: "course_id", sorttype: "ASC" },
          { fieldName: "assignment_type", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast.error("Failed to load grades");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "course_id" } },
          { field: { Name: "assignment_type" } },
          { field: { Name: "weight" } },
          { field: { Name: "score" } },
          { field: { Name: "total" } },
          { field: { Name: "percentage" } }
        ]
      };

      const response = await apperClient.getRecordById('grade', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching grade with ID ${id}:`, error);
      toast.error("Failed to load grade");
      return null;
    }
  },

  async getByCourse(courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "course_id" } },
          { field: { Name: "assignment_type" } },
          { field: { Name: "weight" } },
          { field: { Name: "score" } },
          { field: { Name: "total" } },
          { field: { Name: "percentage" } }
        ],
        where: [
          { FieldName: "course_id", Operator: "EqualTo", Values: [parseInt(courseId, 10)] }
        ]
      };

      const response = await apperClient.fetchRecords('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades by course:", error);
      toast.error("Failed to load grades");
      return [];
    }
  },

  async create(gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: gradeData.Name || `${gradeData.assignment_type} Grade`,
        Tags: gradeData.Tags || gradeData.tags || "",
        Owner: gradeData.Owner || gradeData.owner,
        course_id: parseInt(gradeData.course_id || gradeData.courseId, 10),
        assignment_type: gradeData.assignment_type || gradeData.assignmentType,
        weight: parseInt(gradeData.weight, 10),
        score: parseInt(gradeData.score, 10),
        total: parseInt(gradeData.total, 10),
        percentage: parseFloat(gradeData.percentage)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Grade created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating grade:", error);
      toast.error("Failed to create grade");
      return null;
    }
  },

  async update(id, gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: gradeData.Name || `${gradeData.assignment_type} Grade`,
        Tags: gradeData.Tags || gradeData.tags,
        Owner: gradeData.Owner || gradeData.owner,
        course_id: parseInt(gradeData.course_id || gradeData.courseId, 10),
        assignment_type: gradeData.assignment_type || gradeData.assignmentType,
        weight: parseInt(gradeData.weight, 10),
        score: parseInt(gradeData.score, 10),
        total: parseInt(gradeData.total, 10),
        percentage: parseFloat(gradeData.percentage)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Grade updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating grade:", error);
      toast.error("Failed to update grade");
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('grade', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Grade deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting grade:", error);
      toast.error("Failed to delete grade");
      return false;
    }
  },

  async calculateGPA(courseGrades) {
    // This is a client-side calculation, no API call needed
    if (!courseGrades.length) return 0;
    
    const totalPoints = courseGrades.reduce((sum, course) => {
      return sum + (course.gradePoints * course.credits);
    }, 0);
    
    const totalCredits = courseGrades.reduce((sum, course) => {
      return sum + course.credits;
    }, 0);
    
    return totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  }
};

export default gradeService;