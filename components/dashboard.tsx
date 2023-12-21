import {
  Box,
  Button,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  IconButton,
  Spinner,
  HStack,
} from "@chakra-ui/react"
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons"
import { useFetchMetas } from "../lib/ghostcloud"
import { useEffect, useState } from "react"
import CreateDeploymentModal from "./create-deployment"
import UpdateDeploymentModal from "./update-deployment"
import RemoveDeploymentModal from "./remove-deployment"
import {
  GHOSTCLOUD_URL_DOMAIN,
  GHOSTCLOUD_URL_SCHEME,
} from "../config/ghostcloud-chain"
import useWeb3AuthStore from "../store/web3-auth"
import { truncateAddress } from "../helpers/address"

function createUrl(name: string, address: string) {
  return `${GHOSTCLOUD_URL_SCHEME}://${name}-${address}.${GHOSTCLOUD_URL_DOMAIN}`
}

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [selectedDeploymentName, setSelectedDeploymentName] =
    useState<string>("")
  const [selectedDeploymentDescription, setSelectedDeploymentDescription] =
    useState<string>("")
  const [selectedDeploymentDomain, setSelectedDeploymentDomain] =
    useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [
    { data: metas, isLoading: isMetaLoading },
    currentPage,
    pageCount,
    handlePageClick,
  ] = useFetchMetas()
  const store = useWeb3AuthStore()

  useEffect(() => {
    const fetchAddress = async () => {
      const addr = await store.getAddress()
      setAddress(addr ?? "")
    }
    fetchAddress()
  }, [store])

  const handleUpdate = (name: string, description: string, domain: string) => {
    setSelectedDeploymentName(name)
    setSelectedDeploymentDescription(description)
    setSelectedDeploymentDomain(domain)
    setIsUpdateModalOpen(true)
  }
  const handleRemove = (name: string) => {
    setSelectedDeploymentName(name)
    setIsRemoveModalOpen(true)
  }

  return (
    <Box>
      {isMetaLoading ? <Spinner /> : null}
      {metas ? (
        <>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            float="right"
            mb={2}
          >
            Create Deployment
          </Button>
          <CreateDeploymentModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
          <UpdateDeploymentModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            deploymentName={selectedDeploymentName}
            deploymentDescription={selectedDeploymentDescription}
            deploymentDomain={selectedDeploymentDomain}
          />
          <RemoveDeploymentModal
            isOpen={isRemoveModalOpen}
            onClose={() => setIsRemoveModalOpen(false)}
            deploymentName={selectedDeploymentName}
          />
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Domain</Th>
                <Th>URL</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {metas.meta.map((meta, index) => (
                <Tr key={index}>
                  <Td>{meta.name}</Td>
                  <Td>{meta.description}</Td>
                  <Td>{meta.domain}</Td>
                  <Td>
                    <Link
                      href={createUrl(meta.name, address) + "/index.html"}
                      isExternal
                    >
                      {createUrl(meta.name, truncateAddress(address, 4))}
                    </Link>
                  </Td>
                  <Td>
                    <HStack spacing={0}>
                      <IconButton
                        onClick={() =>
                          handleUpdate(meta.name, meta.description, meta.domain)
                        }
                        aria-label="Update"
                        icon={<EditIcon />}
                        size="sm"
                        mr={2}
                      >
                        Update
                      </IconButton>
                      <IconButton
                        onClick={() => handleRemove(meta.name)}
                        aria-label="Remove"
                        icon={<DeleteIcon />}
                        size="sm"
                      >
                        Remove
                      </IconButton>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {pageCount > 1 && (
            <Center my={8}>
              <IconButton
                icon={<ArrowBackIcon />}
                aria-label="Previous"
                isDisabled={currentPage === 1}
                onClick={() => handlePageClick("prev")}
                data-testid="previous-button"
              />
              <Box mx={4} data-testid="page-info">
                {currentPage} / {pageCount}
              </Box>
              <IconButton
                icon={<ArrowForwardIcon />}
                aria-label="Next"
                isDisabled={currentPage === pageCount}
                onClick={() => handlePageClick("next")}
                data-testid="next-button"
              />
            </Center>
          )}
        </>
      ) : (
        <div>Error fetching deployments. Is the backend online?</div>
      )}
    </Box>
  )
}

export default Dashboard
