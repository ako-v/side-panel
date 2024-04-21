import { useEffect, useRef } from "react";
import { toCanvas } from "qrcode";
import { AbsoluteCenter, Box, Divider, Text, useToast } from "@chakra-ui/react";

export type QRCodeProps = {
  url: string;
};

const QRCode: React.FC<QRCodeProps> = ({ url }) => {
  const QRCodeContainerRef = useRef<null | HTMLCanvasElement>(null);

  const toast = useToast();

  useEffect(() => {
    if (QRCodeContainerRef.current && url) {
      toCanvas(QRCodeContainerRef.current, url, { errorCorrectionLevel: "H", width: 250, margin: 3 }, (error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  }, [url]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // scale down element
    e.currentTarget.style.transform = "scale(0.95)";
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    // scale up element
    navigator.clipboard.writeText(url);
    e.currentTarget.style.transform = "scale(1)";
    toast({
      title: "Copied to clipboard",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box display="flex" alignItems="center" flexDir="column" gap={3}>
      <Box position="relative" padding="2" w="100%">
        <Divider />
        <AbsoluteCenter bg="white" px="4">
          Code
        </AbsoluteCenter>
      </Box>
      <Box border="2px solid black" borderRadius={6}>
        <Box onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
          <canvas ref={QRCodeContainerRef} className="rounded" />
        </Box>
      </Box>
      <Box position="relative" padding="2" w="100%">
        <Divider />
        <AbsoluteCenter bg="white" px="4">
          Link
        </AbsoluteCenter>
      </Box>
      <Box width={250} p={2} border="2px solid black" borderRadius={6}>
        <Text>{url}</Text>
      </Box>
    </Box>
  );
};
export default QRCode;
