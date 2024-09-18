import { useCallback, useEffect, useState } from 'react';
import {
  useFetchProjectsByContactQuery,
  useUpdateProjectMutation,
} from '../services/projectAPI';
import { Project } from 'src/models/project';
import { Contact } from 'src/models/contact';

interface BKClient {
  id: number;
  first_name: string;
  last_name: string;
  type: 'contact';
}

interface BKProject {
  id: number;
  name: string;
  contact_id: number;
  type: 'project';
}

interface IEntry {
  id: number;
  entry_name: string;
  type: 'entry';
}

type BKData = BKClient | BKProject | IEntry;

const useConnectProject = (contact: Contact) => {
  const [updateProject] = useUpdateProjectMutation();

  const { data, isLoading } = useFetchProjectsByContactQuery(
    {
      accountID: contact.account_id,
      contactID: contact.id,
    },
    { refetchOnMountOrArgChange: true },
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [BKProjects, setBKProjects] = useState<BKProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<BKData | null>(null);

  const getProjects = useCallback(() => {
    const url = `https://flowplanr-production.up.railway.app/projects/names/${contact.account_id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: BKProject[]) => {
        const filteredData = data.filter((item) => !item.contact_id);
        const formattedData: BKProject[] = filteredData.map((item) => ({
          id: item.id,
          name: item.name,
          contact_id: item.contact_id,
          type: 'project',
        }));
        setBKProjects(formattedData);
      });
  }, []);

  const handleConnectProject = () => {
    if (selectedProject) {
      const url = `https://flowplanr-production.up.railway.app/projects/details/${selectedProject.id}`;
      fetch(url)
        .then((response) => response.json())
        .then((data: Project) => {
          const foundProject: Project = {
            id: data.id,
            account_id: data.account_id,
            name: data.name,
            description: data.description,
            notes: data.notes,
            creation_date: data.creation_date,
            start_date: data.start_date,
            end_date: data.end_date,
            status: data.status,
            completed: data.completed,
            contact_id: contact.id,
          };
          updateProject(foundProject);
          setProjects([...projects, foundProject]);
        });
    }
  };

  useEffect(() => {
    if (data) {
      setProjects(data);
    }
  }, [data]);

  return {
    projects,
    isLoading,
    BKProjects,
    setSelectedProject,
    getProjects,
    handleConnectProject,
  };
};

export default useConnectProject;
