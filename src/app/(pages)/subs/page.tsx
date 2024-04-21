import { prisma } from "@/app/lib/prisma";
import SubscriptionItem from "@/components/features/SubscriptionField";
import { Box } from "@chakra-ui/react";
import { handleCreateNewItem, handleDeleteItem, handleItemUpdate } from "./actions";
import { Subscription } from "@prisma/client";

export const dynamic = "force-dynamic";

const SubsPage = async () => {
  let subscriptions: Subscription[] = await prisma.subscription.findMany();

  return (
    <Box maxWidth={900} rounded={5} border="1px solid" borderColor="gray.300" minHeight={100} width="100%">
      <Box display="flex" flexDirection="column" gap={5} width="100%" padding={4}>
        {[...subscriptions, { id: 0, name: "", url: "", type: "sub" }].map((item) => (
          <SubscriptionItem
            key={item.id}
            data={item}
            onUpdate={handleItemUpdate}
            onCreate={handleCreateNewItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SubsPage;
