"use client";

import QRCode from "@/components/QRCode";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

export type QRCodeModalProps = {
  url: string;
};

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>QRCode</Button>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pt={2} pb={2}>
            QR Code
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <QRCode url={url} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default QRCodeModal;
