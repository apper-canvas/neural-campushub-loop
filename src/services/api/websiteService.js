import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const tableName = 'website';

// Get all websites
export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords(tableName, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "url"}},
        {"field": {"Name": "description"}},
        {"field": {"Name": "isActive"}},
        {"field": {"Name": "Tags"}}
      ],
      orderBy: [{"fieldName": "Name", "sorttype": "ASC"}]
    });

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching websites:", error?.response?.data?.message || error);
    toast.error("Failed to load websites");
    return [];
  }
};

// Get website by ID
export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById(tableName, id, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "url"}},
        {"field": {"Name": "description"}},
        {"field": {"Name": "isActive"}},
        {"field": {"Name": "Tags"}}
      ]
    });

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching website ${id}:`, error?.response?.data?.message || error);
    toast.error("Failed to load website");
    return null;
  }
};

// Create new website
export const create = async (websiteData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields
    const payload = {
      records: [{
        Name: websiteData.Name,
        url: websiteData.url,
        description: websiteData.description,
        isActive: websiteData.isActive !== undefined ? websiteData.isActive : true,
        Tags: websiteData.Tags
      }]
    };

    const response = await apperClient.createRecord(tableName, payload);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} website records:`, failed);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success("Website created successfully");
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error creating website:", error?.response?.data?.message || error);
    toast.error("Failed to create website");
    return null;
  }
};

// Update website
export const update = async (id, websiteData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include updateable fields
    const payload = {
      records: [{
        Id: id,
        Name: websiteData.Name,
        url: websiteData.url,
        description: websiteData.description,
        isActive: websiteData.isActive,
        Tags: websiteData.Tags
      }]
    };

    const response = await apperClient.updateRecord(tableName, payload);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} website records:`, failed);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success("Website updated successfully");
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error updating website:", error?.response?.data?.message || error);
    toast.error("Failed to update website");
    return null;
  }
};

// Delete website
export const deleteWebsite = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord(tableName, { RecordIds: [id] });

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} website records:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success("Website deleted successfully");
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error deleting website:", error?.response?.data?.message || error);
    toast.error("Failed to delete website");
    return false;
  }
};

export const websiteService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteWebsite
};