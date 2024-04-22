"use client";

import { Box, BoxProps, Button, Input, Select, useToast } from "@chakra-ui/react";
import { Subscription } from "@prisma/client";
import { useMemo, useState } from "react";
import QRCodeModal from "../QRCodeModal";

export type InputRowProps = Omit<BoxProps, "onChange"> & {
  data: Subscription;
  onUpdate: (data: Subscription) => Promise<any>;
  onCreate: (data: Omit<Subscription, "id">) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
};

const SubscriptionItem: React.FC<InputRowProps> = ({ data, onUpdate, onCreate, onDelete, ...rest }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState<Subscription>({
    id: data?.id ?? 0,
    name: data?.name ?? "",
    url: data?.url ?? "",
    type: (data?.type as "sub" | "json") ?? "sub",
  });

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const runOperation = async (fn: () => Promise<any>, successMessage: string, callback?: () => void) => {
    const response = await fn();
    if (response?.error) {
      toast({
        title: response.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      callback?.();
      toast({
        title: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateOrUpdate = async () => {
    setIsLoading(true);
    try {
      if (fields.id) {
        await runOperation(() => onUpdate(fields), "Subscription updated.");
      } else {
        const { id, ...others } = fields;
        await runOperation(
          () => onCreate(others),
          "Subscription created.",
          () => setFields({ id: 0, name: "", url: "", type: "sub" })
        );
      }
    } catch (error) {
      toast({
        title: `Error ${fields.id ? "updating" : "creating"} subscription.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (fields.id) {
        await runOperation(() => onDelete(fields.id), "Subscription deleted.");
      }
    } catch (error) {
      toast({
        title: "Error deleting subscription.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const QRCodeUrl = useMemo(() => {
    if (window !== undefined && fields?.id && fields?.name) {
      return window.location.origin + `/api/subs/${fields.name}`;
    } else {
      return "";
    }
  }, [fields.id, fields.name]);

  return (
    <Box display="flex" gap={3} {...rest}>
      <Input
        name="name"
        placeholder="Name"
        rounded={5}
        size="md"
        width={120}
        value={fields.name}
        onChange={handleFieldChange}
      />
      <Input
        name="url"
        placeholder="URL"
        flex="1 0 0%"
        rounded={5}
        size="md"
        value={fields.url}
        onChange={handleFieldChange}
      />
      <Select name="type" value={fields.type} onChange={handleFieldChange} w="100px">
        <option hidden disabled value="">
          Select option
        </option>
        <option value="sub">Sub</option>
        <option value="json">Json</option>
      </Select>
      <Button isLoading={isLoading} width="80px" colorScheme="blue" size="md" onClick={handleCreateOrUpdate}>
        {fields.id ? "Update" : "Add"}
      </Button>
      {fields.id ? (
        <Button width="80px" isLoading={isLoading} colorScheme="red" onClick={handleDelete}>
          Delete
        </Button>
      ) : null}
      {fields.id ? <QRCodeModal url={QRCodeUrl} /> : null}
    </Box>
  );
};
export default SubscriptionItem;
