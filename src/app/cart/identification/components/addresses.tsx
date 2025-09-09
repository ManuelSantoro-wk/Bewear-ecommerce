"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import cep from "cep-promise";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { updateShippingAddress } from "@/actions/update-shipping-address";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useDeleteShippingAddress } from "@/hooks/mutations/use-Delete-Shipping-Address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useUserAddresses } from "@/hooks/queries/use-user-addresses";

import { formatAddress } from "../../helpers/address";

// -------------------------
// Zod helpers (mesmo schema p/ criar/editar)
// -------------------------
const PT_PHONE_RGX = /^\d{9}$/; // 999999999
const PT_ZIP_RGX = /^\d{4}-\d{3}$/; // 0000-000

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  fullName: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .transform((v) => v.trim()),
  nif: z
    .string()
    .min(9, "NIF inválido")
    .max(9, "NIF deve ter exatamente 9 dígitos")
    .regex(/^\d{9}$/, "NIF deve conter apenas números"),
  phone: z.string().regex(PT_PHONE_RGX, "Telemóvel inválido (ex: 999999999)"),
  zipCode: z
    .string()
    .regex(PT_ZIP_RGX, "Código Postal inválido (ex: 0000-000)")
    .transform((v) => v.trim()),
  address: z.string().min(1, "Morada é obrigatória"),
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .refine((v) => v.trim().length > 0, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Localidade é obrigatória"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Distrito é obrigatório"),
});

type FormValues = z.infer<typeof schema>;

interface AddressesProps {
  shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
  defaultShippingAddressId: string | null;
}

const Addresses = ({
  shippingAddresses,
  defaultShippingAddressId,
}: AddressesProps) => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    defaultShippingAddressId || null,
  );

  // Eliminar Morada
  const deleteShippingAddressMutation = useDeleteShippingAddress();
  // Modal/edição
  const [editOpen, setEditOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<
    typeof shippingAddressTable.$inferSelect | null
  >(null);
  const [isFetchingCodigoPostalCreate, setIsFetchingCodigoPostalCreate] =
    useState(false);
  const [isFetchingCodigoPostalEdit, setIsFetchingCodigoPostalEdit] =
    useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Query + mutations
  const createShippingAddressMutation = useCreateShippingAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const { data: addresses, isLoading } = useUserAddresses({
    initialData: shippingAddresses,
  });

  // Form: criar
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      fullName: "",
      nif: "",
      phone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    mode: "onTouched",
  });

  // Form: editar (estado separado)
  const editForm = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      fullName: "",
      nif: "",
      phone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    mode: "onTouched",
  });

  // Preenche o form de edição quando selecionar morada
  useEffect(() => {
    if (!editingAddress) return;
    editForm.reset({
      email: editingAddress.email ?? "",
      fullName: editingAddress.recipientName ?? "",
      nif: editingAddress.cpfOrCnpj ?? "",
      phone: editingAddress.phone ?? "",
      zipCode: editingAddress.zipCode ?? "",
      address: editingAddress.street ?? "",
      number: editingAddress.number ?? "",
      complement: editingAddress.complement ?? "",
      neighborhood: editingAddress.neighborhood ?? "",
      city: editingAddress.city ?? "",
      state: (editingAddress.state ?? "").toUpperCase(),
    });
  }, [editingAddress, editForm]);

  // Código Postal Auto-complete: criar
  const handleCodigoPostalBlurCreate = async () => {
    const v = form.getValues("zipCode");
    if (!PT_ZIP_RGX.test(v)) return;
    try {
      setIsFetchingCodigoPostalCreate(true);
      const result = await cep(v.replace("-", ""));
      form.setValue("address", result.street || "");
      form.setValue("neighborhood", result.neighborhood || "");
      form.setValue("city", result.city || "");
      form.setValue("state", (result.state || "").toUpperCase());
    } catch (err) {
      toast.error(
        "Não foi possível buscar o Código Postal. Verifique e tente novamente.",
      );
      console.error(err);
    } finally {
      setIsFetchingCodigoPostalCreate(false);
    }
  };

  // Código Postal Auto-complete: editar
  const handleCodigoPostalBlurEdit = async () => {
    const v = editForm.getValues("zipCode");
    if (!PT_ZIP_RGX.test(v)) return;
    try {
      setIsFetchingCodigoPostalEdit(true);
      const result = await cep(v.replace("-", ""));
      editForm.setValue("address", result.street || "");
      editForm.setValue("neighborhood", result.neighborhood || "");
      editForm.setValue("city", result.city || "");
      editForm.setValue("state", (result.state || "").toUpperCase());
    } catch (err) {
      toast.error(
        "Não foi possível buscar o Código Postal. Verifique e tente novamente.",
      );
      console.error(err);
    } finally {
      setIsFetchingCodigoPostalEdit(false);
    }
  };

  // Criar morada
  const onSubmitCreate = async (values: FormValues) => {
    try {
      const newAddress =
        await createShippingAddressMutation.mutateAsync(values);
      toast.success("Morada criada com sucesso!");
      form.reset();
      setSelectedAddress(newAddress.id);

      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: newAddress.id,
      });
      toast.success("Morada vinculada ao carrinho!");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao criar morada. Tente novamente.");
      console.error(error);
    }
  };

  // Salvar edição
  const onSubmitEdit = async (values: FormValues) => {
    if (!editingAddress) return;
    try {
      setIsSavingEdit(true);
      await updateShippingAddress({
        id: editingAddress.id,
        ...values,
      });
      toast.success("Morada atualizada!");
      setEditOpen(false);
      setEditingAddress(null);
      router.refresh();
    } catch (error) {
      toast.error("Erro ao atualizar morada. Tente novamente.");
      console.error(error);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Ir para pagamento
  const handleGoToPayment = async () => {
    if (!selectedAddress || selectedAddress === "add_new") return;

    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: selectedAddress,
      });
      toast.success("Morada selecionada para entrega!");
      router.push("/cart/confirmation");
    } catch (error) {
      toast.error("Erro ao selecionar morada. Tente novamente.");
      console.error(error);
    }
  };

  // Evitar “piscar” se já existe default
  useEffect(() => {
    if (defaultShippingAddressId) {
      setSelectedAddress(defaultShippingAddressId);
    }
  }, [defaultShippingAddressId]);

  const isSubmittingAny =
    createShippingAddressMutation.isPending ||
    updateCartShippingAddressMutation.isPending;

  return (
    <>
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center">
              <p>Carregando moradas...</p>
            </div>
          ) : (
            <RadioGroup
              value={selectedAddress ?? ""}
              onValueChange={setSelectedAddress}
            >
              {addresses?.length === 0 && (
                <div className="py-4 text-center">
                  <p className="text-slate-500">
                    Você ainda não possui moradas cadastradas.
                  </p>
                </div>
              )}

              {addresses?.map((address) => (
                <Card key={address.id} className="mb-3">
                  <CardContent className="flex items-start justify-between gap-3 py-4">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem
                        value={address.id}
                        id={`address-${address.id}`}
                        aria-label={`Selecionar morada ${address.id}`}
                      />
                      <Label
                        htmlFor={`address-${address.id}`}
                        className="cursor-pointer"
                      >
                        <p className="text-sm whitespace-pre-line">
                          {formatAddress(address)}
                        </p>
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer rounded-full"
                        onClick={() => {
                          setEditingAddress(address);
                          setEditOpen(true);
                        }}
                        aria-label="Editar morada"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer rounded-full" // reduz o padding para ficar quadrado
                        onClick={async () => {
                          await deleteShippingAddressMutation.mutateAsync(
                            address.id,
                          );
                          window.location.reload(); // força F5
                        }}
                        aria-label="Eliminar morada"
                      >
                        <Trash2 className="h-4 w-4" />{" "}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="add_new" id="add_new" />
                    <Label className="cursor-pointer" htmlFor="add_new">
                      Adicionar nova morada
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </RadioGroup>
          )}

          {/* Botão ir para pagamento (quando há morada selecionada existente) */}
          {selectedAddress && selectedAddress !== "add_new" && (
            <div className="mt-4">
              <Button
                onClick={handleGoToPayment}
                className="w-full cursor-pointer rounded-full"
                disabled={updateCartShippingAddressMutation.isPending}
              >
                {updateCartShippingAddressMutation.isPending
                  ? "Processando..."
                  : "Ir para pagamento"}
              </Button>
            </div>
          )}

          {/* Form nova morada */}
          {selectedAddress === "add_new" && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitCreate)}
                className="mt-4 space-y-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Nome */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu nome completo"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* NIF */}
                  <FormField
                    control={form.control}
                    name="nif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIF</FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="#########"
                            placeholder="000000000"
                            customInput={Input}
                            value={field.value}
                            onValueChange={(vals) => field.onChange(vals.value)}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Telemóvel */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telemóvel</FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="#########"
                            placeholder="999999999"
                            customInput={Input}
                            value={field.value}
                            onValueChange={(vals) => field.onChange(vals.value)}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Código Postal */}
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código Postal</FormLabel>
                        <FormControl>
                          <PatternFormat
                            format="####-###"
                            placeholder="0000-000"
                            customInput={Input}
                            value={field.value}
                            onValueChange={(vals) =>
                              field.onChange(vals.formattedValue)
                            }
                            onBlur={async () => {
                              field.onBlur?.();
                              await handleCodigoPostalBlurCreate();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Morada */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Morada</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Rua, avenida..."
                            {...field}
                            disabled={isFetchingCodigoPostalCreate}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Número */}
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Complemento */}
                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apto, bloco, etc. (opcional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Localidade */}
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localidade</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Localidade"
                            {...field}
                            disabled={isFetchingCodigoPostalCreate}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cidade */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Cidade"
                            {...field}
                            disabled={isFetchingCodigoPostalCreate}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Distrito */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distrito</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Distrito"
                            {...field}
                            disabled={isFetchingCodigoPostalCreate}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    className="w-full cursor-pointer rounded-full"
                    disabled={isSubmittingAny}
                  >
                    {isSubmittingAny ? "Salvando..." : "Salvar morada"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* Dialog Editar morada */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditingAddress(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar morada</DialogTitle>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmitEdit)}>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Email */}
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nome */}
                <FormField
                  control={editForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu nome completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* NIF */}
                <FormField
                  control={editForm.control}
                  name="nif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIF</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="#########"
                          placeholder="000000000"
                          customInput={Input}
                          value={field.value}
                          onValueChange={(vals) => field.onChange(vals.value)}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Telemóvel */}
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telemóvel</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="#########"
                          placeholder="999999999"
                          customInput={Input}
                          value={field.value}
                          onValueChange={(vals) => field.onChange(vals.value)}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Código Postal */}
                <FormField
                  control={editForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="####-###"
                          placeholder="0000-000"
                          customInput={Input}
                          value={field.value}
                          onValueChange={(vals) =>
                            field.onChange(vals.formattedValue)
                          }
                          onBlur={async () => {
                            field.onBlur?.();
                            await handleCodigoPostalBlurEdit();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Morada */}
                <FormField
                  control={editForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Morada</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Rua, avenida..."
                          {...field}
                          disabled={isFetchingCodigoPostalEdit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Número */}
                <FormField
                  control={editForm.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apto, bloco, etc. (opcional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Localidade */}
                <FormField
                  control={editForm.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localidade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Localidade"
                          {...field}
                          disabled={isFetchingCodigoPostalEdit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cidade */}
                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Cidade"
                          {...field}
                          disabled={isFetchingCodigoPostalEdit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Distrito */}
                <FormField
                  control={editForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distrito</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Distrito"
                          {...field}
                          disabled={isFetchingCodigoPostalEdit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-4 gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setEditOpen(false);
                    setEditingAddress(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="rounded-full"
                  disabled={isSavingEdit}
                >
                  {isSavingEdit ? "Salvando..." : "Salvar alterações"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Addresses;
