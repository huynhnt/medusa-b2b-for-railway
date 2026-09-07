import { HttpTypes } from "@medusajs/framework/types";
import { Link, LockClosedSolid, PencilSquare, Trash } from "@medusajs/icons";
import { toast } from "@medusajs/ui";
import { QueryCompany } from "../../../../types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionMenu } from "../../../components/common";
import { DeletePrompt } from "../../../components/common/delete-prompt";
import { useDeleteCompany } from "../../../hooks/api";
import {
  CompanyApprovalSettingsDrawer,
  CompanyCustomerGroupDrawer,
  CompanyUpdateDrawer,
} from "./";

export const CompanyActionsMenu = ({
  company,
  customerGroups,
}: {
  company: QueryCompany;
  customerGroups?: HttpTypes.AdminCustomerGroup[];
}) => {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = useState(false);
  const [customerGroupOpen, setCustomerGroupOpen] = useState(false);
  const [approvalSettingsOpen, setApprovalSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: mutateDelete, isPending: loadingDelete } =
    useDeleteCompany(company.id);

  const navigate = useNavigate();

  const handleDelete = () => {
    mutateDelete(company.id, {
      onSuccess: () => {
        navigate("/companies");
        toast.success(
          t("companies.deleteSuccess", {
            name: company.name,
            defaultValue: `Company ${company.name} deleted successfully`,
          })
        );
      },
    });
  };

  return (
    <>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon: <PencilSquare />,
                label: t("actions.editDetails", { defaultValue: "Edit details" }),
                onClick: () => setEditOpen(true),
              },
              {
                icon: <Link />,
                label: t("actions.manageCustomerGroup", { defaultValue: "Manage customer group" }),
                onClick: () => setCustomerGroupOpen(true),
              },
              {
                icon: <LockClosedSolid />,
                label: t("actions.approvalSettings", { defaultValue: "Approval settings" }),
                onClick: () => setApprovalSettingsOpen(true),
              },
            ],
          },
          {
            actions: [
              {
                icon: <Trash />,
                label: t("actions.delete", { defaultValue: "Delete" }),
                onClick: () => setDeleteOpen(true),
              },
            ],
          },
        ]}
      />


      <CompanyUpdateDrawer
        company={company}
        open={editOpen}
        setOpen={setEditOpen}
      />
      <CompanyCustomerGroupDrawer
        company={company}
        customerGroups={customerGroups}
        open={customerGroupOpen}
        setOpen={setCustomerGroupOpen}
      />
      <CompanyApprovalSettingsDrawer
        company={company}
        open={approvalSettingsOpen}
        setOpen={setApprovalSettingsOpen}
      />
      <DeletePrompt
        handleDelete={handleDelete}
        loading={loadingDelete}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </>
  );
};
