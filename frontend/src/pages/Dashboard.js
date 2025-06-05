import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiCopy, FiPlay } from 'react-icons/fi';
import { usePresentation } from '../context/PresentationContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import CreatePresentationModal from '../components/CreatePresentationModal';

const DashboardContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
`;

const Header = styled.header`
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  margin: 0;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const PresentationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const PresentationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`;

const CardDescription = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 1rem;
`;

const SlideCount = styled.span`
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  background: white;
  color: #495057;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
  }

  &.primary {
    background: #007bff;
    color: white;
    border-color: #007bff;

    &:hover {
      background: #0056b3;
      border-color: #0056b3;
    }
  }

  &.danger {
    background: #dc3545;
    color: white;
    border-color: #dc3545;

    &:hover {
      background: #c82333;
      border-color: #c82333;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #495057;
  }

  p {
    font-size: 1rem;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    presentations,
    isLoading,
    error,
    searchQuery,
    fetchPresentations,
    setSearchQuery,
    deletePresentation,
    duplicatePresentation,
    clearError
  } = usePresentation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    fetchPresentations(searchQuery);
  }, [searchQuery, fetchPresentations]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput, setSearchQuery]);

  const handleCreatePresentation = () => {
    setShowCreateModal(true);
  };

  const handleEditPresentation = (id, e) => {
    e.stopPropagation();
    navigate(`/presentation/${id}/edit`);
  };

  const handleViewPresentation = (id, e) => {
    e?.stopPropagation();
    navigate(`/presentation/${id}/view`);
  };

  const handlePresentPresentation = (id, e) => {
    e.stopPropagation();
    navigate(`/presentation/${id}/present`);
  };

  const handleDeletePresentation = async (id, e) => {
    e.stopPropagation();
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deletePresentation(deleteConfirm);
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting presentation:', error);
      }
    }
  };

  const handleDuplicatePresentation = async (id, e) => {
    e.stopPropagation();
    try {
      await duplicatePresentation(id);
    } catch (error) {
      console.error('Error duplicating presentation:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <DashboardContainer>
        <Header>
          <Title>Error</Title>
        </Header>
        <MainContent>
          <div style={{ textAlign: 'center', color: '#dc3545' }}>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button onClick={clearError}>Try Again</button>
          </div>
        </MainContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <HeaderTop>
          <Title>My Presentations</Title>
          <CreateButton onClick={handleCreatePresentation}>
            <FiPlus />
            New Presentation
          </CreateButton>
        </HeaderTop>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search presentations..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </SearchContainer>
      </Header>

      <MainContent>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <LoadingSpinner />
          </div>
        ) : presentations.length === 0 ? (
          <EmptyState>
            <h3>No presentations yet</h3>
            <p>Create your first presentation to get started with your markdown slides.</p>
            <CreateButton onClick={handleCreatePresentation}>
              <FiPlus />
              Create Your First Presentation
            </CreateButton>
          </EmptyState>
        ) : (
          <PresentationsGrid>
            {presentations.map((presentation) => (
              <PresentationCard key={presentation.id} onClick={() => handleViewPresentation(presentation.id)}>
                <CardHeader>
                  <div>
                    <CardTitle>{presentation.title}</CardTitle>
                    <CardDescription>
                      {presentation.description || 'No description provided.'}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardMeta>
                  <SlideCount>{presentation.slideCount} slides</SlideCount>
                  <span>Modified {formatDate(presentation.lastModified)}</span>
                </CardMeta>

                <CardActions>
                  <ActionButton
                    className="primary"
                    onClick={(e) => handleEditPresentation(presentation.id, e)}
                    title="Edit presentation"
                  >
                    <FiEdit />
                    Edit
                  </ActionButton>
                  <ActionButton
                    onClick={(e) => handlePresentPresentation(presentation.id, e)}
                    title="Present in fullscreen"
                  >
                    <FiPlay />
                    Present
                  </ActionButton>
                  <ActionButton
                    onClick={(e) => handleDuplicatePresentation(presentation.id, e)}
                    title="Duplicate presentation"
                  >
                    <FiCopy />
                  </ActionButton>
                  <ActionButton
                    className="danger"
                    onClick={(e) => handleDeletePresentation(presentation.id, e)}
                    title="Delete presentation"
                  >
                    <FiTrash2 />
                  </ActionButton>
                </CardActions>
              </PresentationCard>
            ))}
          </PresentationsGrid>
        )}
      </MainContent>

      {showCreateModal && (
        <CreatePresentationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchPresentations(searchQuery);
          }}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Delete Presentation"
          message="Are you sure you want to delete this presentation? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          confirmLabel="Delete"
          confirmVariant="danger"
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 